import runpy
from pathlib import Path


def main() -> None:
    script = Path(__file__).resolve().parent / "raspberry" / "ble_receiver.py"
    runpy.run_path(str(script), run_name="__main__")


if __name__ == "__main__":
    main()
