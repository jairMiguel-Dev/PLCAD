
import os

file_path = r'c:\Users\user\Desktop\Projetos\05\progles\frontend\constants.ts'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
in_conflict = False
in_head = False

for line in lines:
    if line.strip().startswith('<<<<<<< HEAD'):
        in_conflict = True
        in_head = True
        continue
    if line.strip().startswith('======='):
        in_head = False
        continue
    if line.strip().startswith('>>>>>>>'):
        in_conflict = False
        in_head = False
        continue

    if in_conflict:
        if in_head:
            continue # Skip HEAD content
        else:
            new_lines.append(line) # Keep Incoming content
    else:
        new_lines.append(line) # Keep normal content

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Successfully resolved conflicts in constants.ts")
