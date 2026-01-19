from __future__ import annotations

import logging
import os
from typing import Iterable, Optional, Tuple
import math

from langchain_core.language_models.llms import LLM
from vllm import LLM as VLLMEngine
from vllm import SamplingParams

from .config import Settings, get_settings
from .utils import enforce_stop_tokens

logger = logging.getLogger(__name__)


_engine_cache: Optional[VLLMEngine] = None


def _build_vllm_engine(settings: Settings) -> VLLMEngine:
    global _engine_cache
    if _engine_cache is not None:
        return _engine_cache
    
    if settings.hf_token:
        os.environ["HUGGING_FACE_HUB_TOKEN"] = settings.hf_token

    logger.info("Loading VLLM engine for %s", settings.model_id)
    # Model is pre-quantized with bitsandbytes NF4, matching the working test code
    # Must use load_format="bitsandbytes" when quantization="bitsandbytes"
    engine = VLLMEngine(
        model=settings.model_id,
        tokenizer=settings.model_id,
        trust_remote_code=True,
        download_dir=str(settings.model_cache_dir),
        revision=settings.model_revision,
        dtype=settings.dtype,
        gpu_memory_utilization=settings.gpu_memory_utilization,
        tensor_parallel_size=settings.tensor_parallel_size,
        enforce_eager=True,
        max_model_len=2048,  # Match working test code (was 4096)
        quantization="bitsandbytes",  # Model is pre-quantized with bitsandbytes
        load_format="bitsandbytes",  # Required when using bitsandbytes quantization
    )
    _engine_cache = engine
    return engine


class VLLMLangChainAdapter(LLM):
    def __init__(self, engine: VLLMEngine, settings: Settings):
        super().__init__()
        self._engine = engine  # Use private attribute to avoid serialization issues
        self._settings = settings  # Also make settings private

    @property
    def _llm_type(self) -> str:
        return "custom_vllm"
    
    @property
    def _identifying_params(self) -> dict:
        """Return identifying parameters to avoid serialization issues."""
        return {
            "model_type": "custom_vllm",
            "model_id": self._settings.model_id,
        }

    def _call(
        self,
        prompt: str,
        stop: Optional[Iterable[str]] = None,
        run_manager=None,
        **kwargs,
    ) -> str:
        temperature = kwargs.get("temperature", self._settings.temperature)
        max_tokens = kwargs.get("max_new_tokens", self._settings.max_new_tokens)
        text, _ = generate_with_confidence(
            prompt=prompt,
            temperature=temperature,
            max_new_tokens=max_tokens,
            stop=stop,
        )
        return text


def get_engine() -> VLLMEngine:
    settings = get_settings()
    return _build_vllm_engine(settings)


def get_langchain_llm() -> VLLMLangChainAdapter:
    settings = get_settings()
    engine = get_engine()
    return VLLMLangChainAdapter(engine, settings)


def generate_with_confidence(
    prompt: str,
    temperature: float | None = None,
    max_new_tokens: int | None = None,
    stop: Optional[Iterable[str]] = None,
) -> Tuple[str, float]:
    settings = get_settings()
    engine = get_engine()
    sampling_params = SamplingParams(
        temperature=temperature
        if temperature is not None
        else settings.temperature,
        max_tokens=max_new_tokens
        if max_new_tokens is not None
        else settings.max_new_tokens,
        repetition_penalty=settings.repetition_penalty,
        logprobs=1,
    )
    outputs = engine.generate([prompt], sampling_params, use_tqdm=False)
    output = outputs[0]
    generated_text = output.outputs[0].text
    if stop:
        generated_text = enforce_stop_tokens(generated_text, stop)

    token_logprobs = output.outputs[0].logprobs
    probs = []
    for token_dict in token_logprobs:
        for _, logprob_obj in token_dict.items():
            probs.append(math.exp(float(logprob_obj.logprob)))
            break

    avg_conf = sum(probs) / len(probs) if probs else 0.0
    return generated_text, avg_conf

