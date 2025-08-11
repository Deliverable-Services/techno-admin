#!/bin/bash

# Script to migrate Bootstrap components to shadcn/ui
echo "Starting Bootstrap to shadcn/ui migration..."

# Find all TypeScript/TSX files with Bootstrap imports
find src -name "*.tsx" -type f -exec grep -l "react-bootstrap" {} \; > bootstrap_files.txt

echo "Found $(wc -l < bootstrap_files.txt) files with Bootstrap imports"

# Replace common Bootstrap imports with shadcn/ui imports
while IFS= read -r file; do
  echo "Processing: $file"
  
  # Replace Button imports
  sed -i '' 's/import { Button } from "react-bootstrap";/import { Button } from ".\/ui\/button";/g' "$file"
  sed -i '' 's/import { Button, /import { Button } from ".\/ui\/button";\nimport { /g' "$file"
  sed -i '' 's/, Button } from "react-bootstrap";/} from "react-bootstrap";\nimport { Button } from ".\/ui\/button";/g' "$file"
  
  # Replace Container with div
  sed -i '' 's/<Container fluid/<div className="container-fluid/g' "$file"
  sed -i '' 's/<Container/<div className="container mx-auto px-4/g' "$file"
  sed -i '' 's/<\/Container>/<\/div>/g' "$file"
  
  # Replace Row and Col with grid
  sed -i '' 's/<Row/<div className="grid grid-cols-12 gap-4/g' "$file"
  sed -i '' 's/<\/Row>/<\/div>/g' "$file"
  sed -i '' 's/<Col md="6"/<div className="col-span-6/g' "$file"
  sed -i '' 's/<Col md="4"/<div className="col-span-4/g' "$file"
  sed -i '' 's/<Col md="3"/<div className="col-span-3/g' "$file"
  sed -i '' 's/<Col/<div className="col-span-12/g' "$file"
  sed -i '' 's/<\/Col>/<\/div>/g' "$file"
  
  # Replace Spinner with Loader2
  sed -i '' 's/<Spinner animation="border" size="sm" \/>/<Loader2 className="h-4 w-4 animate-spin" \/>/g' "$file"
  sed -i '' 's/<Spinner animation="border" \/>/<Loader2 className="h-5 w-5 animate-spin" \/>/g' "$file"
  
  # Remove Bootstrap imports and add necessary shadcn imports
  sed -i '' '/import.*react-bootstrap/d' "$file"
  
  # Add common shadcn imports if not present
  if ! grep -q "import { Button } from" "$file"; then
    sed -i '' '1i\
import { Button } from "../ui/button";\
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";\
import { Input } from "../ui/input";\
import { Label } from "../ui/label";\
import { Loader2 } from "lucide-react";\
' "$file"
  fi
  
done < bootstrap_files.txt

echo "Migration complete!"
rm bootstrap_files.txt
