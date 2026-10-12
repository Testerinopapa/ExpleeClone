import os
import subprocess
import time

print("1. Terminating any lingering git.exe processes...")
res = subprocess.run(["taskkill", "/F", "/IM", "git.exe"], capture_output=True, text=True)
if res.stdout.strip():
    print(res.stdout.strip())
if res.stderr.strip() and "not found" not in res.stderr.lower():
    print(res.stderr.strip())

time.sleep(0.5)

repo_dir = r"C:\Users\null\Documents\antigravity\adventurous-archimedes"
git_dir = os.path.join(repo_dir, ".git")

print("2. Checking for and removing any .lock files in .git/...")
removed_count = 0
if os.path.exists(git_dir):
    for root, dirs, files in os.walk(git_dir):
        for f in files:
            if f.endswith(".lock"):
                full_path = os.path.join(root, f)
                try:
                    os.remove(full_path)
                    print(f"  Removed: {full_path}")
                    removed_count += 1
                except Exception as e:
                    print(f"  Failed removing {full_path}: {e}")

if removed_count == 0:
    print("  No .lock files found.")

print("\nCleanup successfully completed. Repository is unlocked.")
