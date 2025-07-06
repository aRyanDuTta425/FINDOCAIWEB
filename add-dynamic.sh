#!/bin/bash

# List of files that need dynamic export
files=(
  "app/api/auth/signup/route.ts"
  "app/api/auth/logout/route.ts"
  "app/api/chat/route.ts"
  "app/api/embeddings/route.ts"
  "app/api/ocr/route.ts"
  "app/api/analyze/route.ts"
  "app/api/process/route.ts"
  "app/api/documents/[id]/route.ts"
  "app/api/dashboard/ocr/route.ts"
  "app/api/dashboard/transactions/route.ts"
)

for file in "${files[@]}"; do
  if [ -f "$file" ] && ! grep -q "export const dynamic" "$file"; then
    echo "Adding dynamic export to $file"
    # Insert after the last import line
    awk '/^import.*from/ {imports = NR} END {print imports}' "$file" | {
      read last_import_line
      if [ "$last_import_line" -gt 0 ]; then
        sed -i '' "${last_import_line}a\\
\\
export const dynamic = 'force-dynamic'
" "$file"
      fi
    }
  fi
done
