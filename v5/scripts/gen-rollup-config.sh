#!/bin/bash

CONFIG_FILE="rollup.config.apps.js"
APPS_DIR="apps/based"
DIST_DIR="dist/apps/based"

echo "// Auto-generated Rollup config for all apps" > $CONFIG_FILE
echo "import resolve from '@rollup/plugin-node-resolve';" >> $CONFIG_FILE
echo "import commonjs from '@rollup/plugin-commonjs';" >> $CONFIG_FILE
echo "import postcss from 'rollup-plugin-postcss';" >> $CONFIG_FILE
echo "import terser from '@rollup/plugin-terser';" >> $CONFIG_FILE
echo "import path from 'path';" >> $CONFIG_FILE
echo "" >> $CONFIG_FILE
echo "export default [" >> $CONFIG_FILE

FIRST=1

for dir in $APPS_DIR/*; do
  [ -d "$dir" ] || continue
  app=$(basename "$dir")
  jsPath="$APPS_DIR/$app/$app.js"
  cssPath="$APPS_DIR/$app/$app.css"
  cssEntry="$APPS_DIR/$app/$app-style.js"
  jsOut="$DIST_DIR/$app.js"
  cssOut="$DIST_DIR/$app.css"

  if [ $FIRST -eq 0 ]; then
    echo "," >> $CONFIG_FILE
  fi
  FIRST=0

  # JS Build
  cat >> $CONFIG_FILE <<EOF
  {
    input: '$jsPath',
    output: {
      file: '$jsOut',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
EOF

  # CSS Build
  if [ -f "$cssPath" ]; then
    # Create app-style.js if not already present
    if [ ! -f "$cssEntry" ]; then
      echo "import './$app.css';" > "$cssEntry"
    fi

    echo "," >> $CONFIG_FILE
    cat >> $CONFIG_FILE <<EOF
  {
    input: '$cssEntry',
    output: {
      file: 'dist/dummy-css.js',
      format: 'es',
    },
    plugins: [
      postcss({
        extract: path.resolve('$cssOut'),
        minimize: true,
        sourceMap: true
      })
    ]
  }
EOF
  fi
done

echo "];" >> $CONFIG_FILE
echo "✅ Rollup config generated in $CONFIG_FILE"
