import subprocess
import sys

def run(cmd):
    print(f"--- Running: {' '.join(cmd)} ---")
    try:
        res = subprocess.run(
            cmd,
            cwd=r"C:\Users\null\Documents\antigravity\adventurous-archimedes",
            capture_output=True,
            text=True,
            timeout=30
        )
        print("STDOUT:")
        print(res.stdout)
        if res.stderr:
            print("STDERR:")
            print(res.stderr)
        print(f"Exit code: {res.returncode}")
        return res
    except subprocess.TimeoutExpired:
        print("Command timed out after 30 seconds!")
        return None
    except Exception as e:
        print(f"Exception: {e}")
        return None

if __name__ == "__main__":
    if len(sys.argv) > 1:
        run(sys.argv[1:])
    else:
        run(["git", "status", "--porcelain"])
