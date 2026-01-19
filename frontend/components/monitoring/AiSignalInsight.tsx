import { aiInsights } from "@/lib/data";

export function AiSignalInsight() {
  return (
    <div className="rounded-2xl border border-dashed border-primary/40 bg-card/80 p-6">
      <p className="text-sm font-semibold">AI signal analysis</p>
      <p className="text-xs text-muted-foreground">Powered by arrhythmia + PPG models</p>
      <div className="mt-4 space-y-3">
        {aiInsights.map((insight) => (
          <div key={insight.id} className="rounded-xl border border-white/10 bg-background/70 p-3">
            <p className="text-sm font-semibold">{insight.title}</p>
            <p className="text-xs text-muted-foreground">{insight.detail}</p>
            <p className="text-xs text-primary">Confidence {(insight.confidence * 100).toFixed(0)}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}
