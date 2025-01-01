# run vite build for bp ( main package )
vite build

# run rollup for each apps/based ( packages )
rollup -c

# copy the new build file from ./dist/buddypond.umd.cjs to ./public/buddypond.umd.cjs
cp ./dist/buddypond.umd.cjs ./public/buddypond.umd.js

