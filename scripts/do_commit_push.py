import subprocess
import sys

def run(cmd):
    print(f"=== Running: {' '.join(cmd)} ===")
    res = subprocess.run(
        cmd,
        cwd=r"C:\Users\null\Documents\antigravity\adventurous-archimedes",
        capture_output=True,
        text=True
    )
    print("STDOUT:")
    print(res.stdout)
    if res.stderr:
        print("STDERR:")
        print(res.stderr)
    print(f"Return code: {res.returncode}")
    return res

if __name__ == "__main__":
    # 1. Add all
    run(["git", "add", "-A"])
    
    # 2. Commit
    msg = "Add full Explee 5-product navigation routing, GM dataset clone, B2B database, Scalar API docs, Explorer, and components"
    run(["git", "commit", "-m", msg])
    
    # 3. Push
    run(["git", "push"])
