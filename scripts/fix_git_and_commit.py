import os
import sys
import subprocess
import time

REPO = r"C:\Users\null\Documents\antigravity\adventurous-archimedes"
LOCK_FILE = os.path.join(REPO, ".git", "index.lock")

def run(cmd, timeout=120):
    print(f"=== Running: {' '.join(cmd)} ===")
    try:
        res = subprocess.run(
            cmd,
            cwd=REPO,
            capture_output=True,
            text=True,
            timeout=timeout
        )
        print("STDOUT:", res.stdout)
        if res.stderr:
            print("STDERR:", res.stderr)
        print("Return code:", res.returncode)
        return res
    except Exception as e:
        print(f"Exception running {' '.join(cmd)}: {e}")
        return None

# 1. Kill any running git processes
print("1. Terminating any lingering git processes...")
subprocess.run(["taskkill", "/F", "/IM", "git.exe"], capture_output=True)

# 2. Check and remove index.lock
time.sleep(0.5)
if os.path.exists(LOCK_FILE):
    print(f"Removing {LOCK_FILE}...")
    try:
        os.remove(LOCK_FILE)
        print("Lock file removed.")
    except Exception as e:
        print(f"Error removing lock: {e}")
else:
    print("No index.lock found.")

# 3. Check git status
print("\n3. Checking git status...")
run(["git", "status", "--short"])

# 4. Add all changes
print("\n4. Running git add -A...")
t0 = time.time()
res_add = run(["git", "add", "-A"], timeout=180)
print(f"git add took {time.time() - t0:.2f} seconds")

# 5. Commit
print("\n5. Running git commit...")
msg = "Implement Explee 5-product navigation routing, GM dataset clone, B2B database, Scalar docs, and Explorer"
run(["git", "commit", "-m", msg])

# 6. Push
print("\n6. Running git push...")
run(["git", "push"], timeout=180)
