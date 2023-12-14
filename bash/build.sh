build() {
  echo "Building project..."
  handle_dist_reset
  handle_webapp_migration_to_dist
  handle_ts_compilation_minification_migration_to_dist
  handle_sass_compilation_minification_migration_to_dist
  echo "Finished building project"
}

handle_dist_reset() {
  dist_dir="dist"
  if [ -d "$dist_dir" ]; then
    rm -r "$dist_dir"
  fi
  mkdir "$dist_dir"
  echo "Dist directory reset"
}
handle_webapp_migration_to_dist() {
  misc_source_dir="src"
  misc_dist_dir="dist"
  cp -r "$misc_source_dir/assets" "$misc_dist_dir/assets"
  cp "$misc_source_dir/favicon.ico" "$misc_dist_dir/favicon.ico"
  cp "$misc_source_dir/robots.txt" "$misc_dist_dir/robots.txt"
  cp "$misc_source_dir/sitemap.xml" "$misc_dist_dir/sitemap.xml"
  cp "$misc_source_dir/index.html" "$misc_dist_dir/index.html"
  echo "Webapp app files migrated from src to dist"
}
handle_ts_compilation_minification_migration_to_dist() {
  tsc
  js_source_dir="dist/js"
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
handle_sass_compilation_minification_migration_to_dist() {
  scss_source_dir="src/styles"
  css_source_dir="dist/css"
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