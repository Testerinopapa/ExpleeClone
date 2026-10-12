import json
import sys

with open('explorerpage/cluster master.json', 'r', encoding='utf-8') as f:
    master1 = json.load(f)

with open('explorerpage/cluster-master.json', 'r', encoding='utf-8') as f:
    master2 = json.load(f)

with open('scripts/cluster_master_1_dump.txt', 'w', encoding='utf-8') as f:
    f.write("=== CLUSTER MASTER 1 (NO QUERY / LANDING) ===\n")
    for el in master1.get('visual', {}).get('elements', []):
        f.write(f"[{el.get('index')}] <{el.get('tag')}> class={el.get('attrs', {}).get('class')} id={el.get('attrs', {}).get('id')} text={repr(el.get('text'))} rect={el.get('rect')} attrs={el.get('attrs')}\n")

with open('scripts/cluster_master_2_dump.txt', 'w', encoding='utf-8') as f:
    f.write("=== CLUSTER MASTER 2 (QUERY: day spa) ===\n")
    for el in master2.get('visual', {}).get('elements', []):
        f.write(f"[{el.get('index')}] <{el.get('tag')}> class={el.get('attrs', {}).get('class')} id={el.get('attrs', {}).get('id')} text={repr(el.get('text'))} rect={el.get('rect')} attrs={el.get('attrs')}\n")

print("Dumped both files successfully.")
