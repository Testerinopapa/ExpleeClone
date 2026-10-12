"""Restore or clean offline reference captures without touching app data."""
import argparse
import gzip
import shutil
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("action", choices=("restore", "clean"))
    args = parser.parse_args()
    root = Path(__file__).resolve().parent.parent
    captures = sorted((root / "explee-visual-capture" / "pages").glob("*/visual.json.gz"))
    for compressed in captures:
        restored = compressed.with_suffix("")
        if args.action == "restore":
            if restored.exists():
                continue
            temporary = restored.with_suffix(".json.tmp")
            try:
                with gzip.open(compressed, "rb") as source, temporary.open("wb") as target:
                    shutil.copyfileobj(source, target)
                temporary.replace(restored)
            finally:
                temporary.unlink(missing_ok=True)
        else:
            restored.unlink(missing_ok=True)
    print(f"{args.action}: {len(captures)} compressed reference captures; archives retained")


if __name__ == "__main__":
    main()