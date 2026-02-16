#!/bin/bash
# Process product images from SMB share into web-ready format
# Usage: ./process_images.sh

set +e

SRC="/Volumes/CreativeTeam/For_Erfan/Marketing_Faces"
DEST="/Users/erfan.tari/slab-sight/public/images"

# Higher quality settings - priority is image quality
STRIP_WIDTH=1000
GRID_WIDTH=600
THUMB_WIDTH=500
QUALITY=92

# Normalize size directory name to canonical format (lowercase x)
normalize_size() {
  echo "$1" | sed 's/X/x/g' | sed 's/-/x/g'
}

# Determine if a format is strip or grid
is_strip_format() {
  case "$1" in
    120x280|160x320|90x180) return 0 ;;
    *) return 1 ;;
  esac
}

# Skip known non-image directories and 90x90
is_skip_dir() {
  local normalized
  normalized=$(normalize_size "$1")
  case "$normalized" in
    *emporary*|*Smaller*|*.py|90x90) return 0 ;;
    *) return 1 ;;
  esac
}

# Natural sort key for filenames like F1.jpg, F01.jpg, F1-2.jpg
sort_key() {
  local name="$1"
  local primary secondary
  primary=$(echo "$name" | sed -E 's/^[fF]0*([0-9]+).*/\1/')
  secondary=$(echo "$name" | sed -E 's/^[fF][0-9]+-([0-9]+).*/\1/')
  if [ "$secondary" = "$name" ]; then
    secondary=0
  fi
  printf "%05d.%05d" "$primary" "$secondary"
}

# Process image files from a source dir, output to dest dir with sequential naming
process_image_files() {
  local src_dir="$1"
  local dest_dir="$2"
  local resize_width="$3"
  local ext_pattern="$4"
  local convert_format="$5"

  mkdir -p "$dest_dir"

  local files=()
  if [ "$ext_pattern" = "jpg" ]; then
    while IFS= read -r f; do
      [ -n "$f" ] && files+=("$f")
    done < <(find "$src_dir" -maxdepth 1 \( -iname "*.jpg" -o -iname "*.jpeg" \) 2>/dev/null)
  else
    while IFS= read -r f; do
      [ -n "$f" ] && files+=("$f")
    done < <(find "$src_dir" -maxdepth 1 \( -iname "*.tif" -o -iname "*.tiff" \) -not -iname "*all*" 2>/dev/null)
  fi

  [ ${#files[@]} -eq 0 ] && return 1

  local keys=()
  for f in "${files[@]}"; do
    local bn=$(basename "$f")
    local key=$(sort_key "$bn")
    keys+=("$key|$f")
  done

  local sorted_keys
  sorted_keys=$(printf '%s\n' "${keys[@]}" | sort)

  local face_idx=1
  while IFS='|' read -r key filepath; do
    [ -z "$filepath" ] && continue
    local out="$dest_dir/F${face_idx}.jpg"
    if [ -n "$convert_format" ]; then
      sips -s format jpeg --resampleWidth "$resize_width" --setProperty formatOptions "$QUALITY" "$filepath" --out "$out" 2>/dev/null
    else
      sips --resampleWidth "$resize_width" --setProperty formatOptions "$QUALITY" "$filepath" --out "$out" 2>/dev/null
    fi
    face_idx=$((face_idx + 1))
  done <<< "$sorted_keys"

  return 0
}

# Process a single product
process_product() {
  local product_dir="$1"
  local product_name
  product_name=$(basename "$product_dir" | sed 's/ *$//')

  echo "Processing: $product_name"

  local dest_dir="$DEST/$product_name"
  mkdir -p "$dest_dir"

  local thumb_created=false

  for size_dir in "$product_dir"/*/; do
    [ ! -d "$size_dir" ] && continue
    local raw_size
    raw_size=$(basename "$size_dir")

    if is_skip_dir "$raw_size"; then
      continue
    fi

    local size
    size=$(normalize_size "$raw_size")

    local img_dir=""
    local img_type=""
    local convert=""

    for subdir in "$size_dir"/JPG "$size_dir"/jpeg; do
      if [ -d "$subdir" ]; then
        local count=$(find "$subdir" -maxdepth 1 \( -iname "*.jpg" -o -iname "*.jpeg" \) | wc -l | tr -d ' ')
        if [ "$count" -gt 0 ]; then
          img_dir="$subdir"
          img_type="jpg"
          break
        fi
      fi
    done

    if [ -z "$img_dir" ]; then
      for subdir in "$size_dir"/Tif "$size_dir"/TIF "$size_dir"/tif; do
        if [ -d "$subdir" ]; then
          local count=$(find "$subdir" -maxdepth 1 \( -iname "*.tif" -o -iname "*.tiff" \) -not -iname "*all*" | wc -l | tr -d ' ')
          if [ "$count" -gt 0 ]; then
            img_dir="$subdir"
            img_type="tif"
            convert="jpeg"
            break
          fi
        fi
      done
    fi

    if [ -z "$img_dir" ]; then
      local jpg_count=$(find "$size_dir" -maxdepth 1 \( -iname "*.jpg" -o -iname "*.jpeg" \) | wc -l | tr -d ' ')
      local tif_count=$(find "$size_dir" -maxdepth 1 \( -iname "*.tif" -o -iname "*.tiff" \) -not -iname "*all*" | wc -l | tr -d ' ')
      if [ "$jpg_count" -gt 0 ]; then
        img_dir="$size_dir"
        img_type="jpg"
      elif [ "$tif_count" -gt 0 ]; then
        img_dir="$size_dir"
        img_type="tif"
        convert="jpeg"
      fi
    fi

    [ -z "$img_dir" ] && continue

    local resize_width=$GRID_WIDTH
    if is_strip_format "$size"; then
      resize_width=$STRIP_WIDTH
    fi

    local size_dest="$dest_dir/$size"
    process_image_files "$img_dir" "$size_dest" "$resize_width" "$img_type" "$convert"

    if [ "$thumb_created" = false ] && is_strip_format "$size" && [ -f "$size_dest/F1.jpg" ]; then
      cp "$size_dest/F1.jpg" "$dest_dir/thumb.jpg"
      sips --resampleWidth "$THUMB_WIDTH" "$dest_dir/thumb.jpg" 2>/dev/null
      thumb_created=true
    fi
  done

  if [ "$thumb_created" = false ]; then
    local any_f1=$(find "$dest_dir" -name "F1.jpg" -not -name "thumb.jpg" | head -1)
    if [ -n "$any_f1" ]; then
      cp "$any_f1" "$dest_dir/thumb.jpg"
      sips --resampleWidth "$THUMB_WIDTH" "$dest_dir/thumb.jpg" 2>/dev/null
      thumb_created=true
    fi
  fi

  [ "$thumb_created" = false ] && echo "  WARNING: No thumbnail for $product_name"
}

# Main
echo "=== Slab-Sight Image Processor (High Quality) ==="
echo "Source: $SRC"
echo "Destination: $DEST"
echo "Strip width: ${STRIP_WIDTH}px, Grid width: ${GRID_WIDTH}px, Quality: ${QUALITY}%"

[ ! -d "$SRC" ] && echo "ERROR: Source not found: $SRC" && exit 1

rm -rf "$DEST"
mkdir -p "$DEST"

for product_dir in "$SRC"/*/; do
  [ ! -d "$product_dir" ] && continue
  product_name=$(basename "$product_dir")
  [ "$product_name" = "tif_to_jpg_converter.py" ] && continue

  file_count=$(find "$product_dir" \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.tif" -o -iname "*.tiff" \) 2>/dev/null | wc -l | tr -d ' ')
  [ "$file_count" -eq 0 ] && echo "Skipping (empty): $product_name" && continue

  process_product "$product_dir"
done

# Cleanup empty dirs
find "$DEST" -type d -empty -delete 2>/dev/null

echo ""
echo "=== Done ==="
du -sh "$DEST"
echo "Products: $(ls -d "$DEST"/*/ 2>/dev/null | wc -l | tr -d ' ')"
