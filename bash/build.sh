build() {
  echo "Building project..."
  handle_dist_dir_reset
  handle_html
  handle_misc
  handle_ts
  handle_sass
  echo "Finished building project"
}

handle_dist_dir_reset() {
  dist_dir="dist"
  if [ -d "$dist_dir" ]; then
    rm -r "$dist_dir"
  fi
  mkdir "$dist_dir"
  echo "Created new dist directory: $dist_dir"
}
handle_html() {
  html_source_dir="src"
  html_dist_dir="dist"
  for html_file in "$html_source_dir"/*.html; do
    if [ -f "$html_file" ]; then
      file_name=$(basename "$html_file")
      cp "$html_file" "$html_dist_dir/$file_name"
    fi
  done
  echo "Copied HTML files to dist directory"
}
handle_misc() {
  misc_source_dir="src"
  misc_dist_dir="dist"
  for misc_file in "$misc_source_dir"/*ico; do
    if [ -f "$misc_file" ]; then
      file_name=$(basename "$misc_file")
      cp "$misc_file" "$misc_dist_dir/$file_name"
    fi
  done
  for misc_file in "$misc_source_dir"/*png; do
    if [ -f "$misc_file" ]; then
      file_name=$(basename "$misc_file")
      cp "$misc_file" "$misc_dist_dir/$file_name"
    fi
  done
  echo "Copied misc files to dist directory"
}
handle_ts() {
  tsc
  js_source_dir="dist/scripts"
  for js_file in "$js_source_dir"/*.js; do
    if [ -f "$js_file" ]; then
      file_name="${js_file##*/}"
      file_name="${file_name%.*}"
      file_path="${js_file%/*}/${file_name}.min.js"
      yarn uglifyjs "$js_file" -o "$file_path"
    fi
  done
  echo "Compiled TypeScript to JavaScript and minified"
}
handle_sass() {
  scss_source_dir="src/styles"
  css_source_dir="dist/styles"
  for scss_file in "$scss_source_dir"/*.scss; do
    if [ -f "$scss_file" ]; then
      file_name=$(basename "$scss_file" .scss)
      file_path="$css_source_dir/$file_name.css"
      sass "$scss_file" "$file_path"
    fi
  done
  for css_file in "$css_source_dir"/*.css; do
    if [ -f "$css_file" ]; then
      file_name=$(basename "$css_file" .css)
      file_path="$css_source_dir/$file_name.min.css"
      yarn uglifycss "$css_file" > "$file_path"
      tail -n +2 "$file_path" > "$file_path.tmp"
      mv "$file_path.tmp" "$file_path"
    fi
  done
  echo "Compiled SASS to CSS and minified"
}

build