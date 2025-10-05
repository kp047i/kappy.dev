#!/usr/bin/bash
TARGET_FILE="./package-lock.json"
PATTERN_FILE="./list.txt"

while read pattern; do
  if grep -iq "$pattern" "$TARGET_FILE";  then
    echo "[WARNING!!] your project depends on $pattern"
  else
    true
    # echo "your project does not depends on $pattern"
  fi
done < "$PATTERN_FILE"