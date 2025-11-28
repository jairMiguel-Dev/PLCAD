
import os

file_path = r'c:\Users\user\Desktop\Projetos\05\progles\frontend\constants.ts'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

marker = "// --- DYNAMIC LEVEL GENERATION FOR INFINITE SCROLL ---"
indices = [i for i, line in enumerate(lines) if marker in line]

if len(indices) >= 2:
    start_delete = indices[0]
    end_delete = indices[1]
    
    print(f"Found duplicate blocks. Deleting from line {start_delete + 1} to {end_delete}")
    
    # Keep everything before the first marker, and everything from the second marker onwards
    new_lines = lines[:start_delete] + lines[end_delete:]
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print("File fixed.")
else:
    print(f"Did not find 2 occurrences of marker. Found {len(indices)}.")
