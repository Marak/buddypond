// Auto-generated Rollup config for all apps
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser';
import path from 'path';

export default [
  {
    input: 'apps/based/_example/_example.js',
    output: {
      file: 'dist/apps/based/_example.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/admin/admin.js',
    output: {
      file: 'dist/apps/based/admin.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/admin/admin-style.js',
    output: {
      file: 'dist/dummy-css.js',
      format: 'es',
    },
    plugins: [
      postcss({
        extract: path.resolve('dist/apps/based/admin.css'),
        minimize: true,
        sourceMap: true
      })
    ]
  }
,
  {
    input: 'apps/based/admin-profile/admin-profile.js',
    output: {
      file: 'dist/apps/based/admin-profile.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/admin-profile/admin-profile-style.js',
    output: {
      file: 'dist/dummy-css.js',
      format: 'es',
    },
    plugins: [
      postcss({
        extract: path.resolve('dist/apps/based/admin-profile.css'),
        minimize: true,
        sourceMap: true
      })
    ]
  }
,
  {
    input: 'apps/based/aero-player/aero-player.js',
    output: {
      file: 'dist/apps/based/aero-player.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/affirmations/affirmations.js',
    output: {
      file: 'dist/apps/based/affirmations.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/appstore/appstore.js',
    output: {
      file: 'dist/apps/based/appstore.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/audio-analyzer/audio-analyzer.js',
    output: {
      file: 'dist/apps/based/audio-analyzer.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/audio-library/audio-library.js',
    output: {
      file: 'dist/apps/based/audio-library.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/audio-player/audio-player.js',
    output: {
      file: 'dist/apps/based/audio-player.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/audio-stripe/audio-stripe.js',
    output: {
      file: 'dist/apps/based/audio-stripe.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/audio-track/audio-track.js',
    output: {
      file: 'dist/apps/based/audio-track.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/audio-visual/audio-visual.js',
    output: {
      file: 'dist/apps/based/audio-visual.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/avatar/avatar.js',
    output: {
      file: 'dist/apps/based/avatar.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/browser/browser.js',
    output: {
      file: 'dist/apps/based/browser.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/browser/browser-style.js',
    output: {
      file: 'dist/dummy-css.js',
      format: 'es',
    },
    plugins: [
      postcss({
        extract: path.resolve('dist/apps/based/browser.css'),
        minimize: true,
        sourceMap: true
      })
    ]
  }
,
  {
    input: 'apps/based/bubblepop/bubblepop.js',
    output: {
      file: 'dist/apps/based/bubblepop.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/bubblepop/bubblepop-style.js',
    output: {
      file: 'dist/dummy-css.js',
      format: 'es',
    },
    plugins: [
      postcss({
        extract: path.resolve('dist/apps/based/bubblepop.css'),
        minimize: true,
        sourceMap: true
      })
    ]
  }
,
  {
    input: 'apps/based/buddybux/buddybux.js',
    output: {
      file: 'dist/apps/based/buddybux.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/buddybux/buddybux-style.js',
    output: {
      file: 'dist/dummy-css.js',
      format: 'es',
    },
    plugins: [
      postcss({
        extract: path.resolve('dist/apps/based/buddybux.css'),
        minimize: true,
        sourceMap: true
      })
    ]
  }
,
  {
    input: 'apps/based/buddylist/buddylist.js',
    output: {
      file: 'dist/apps/based/buddylist.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/buddylist/buddylist-style.js',
    output: {
      file: 'dist/dummy-css.js',
      format: 'es',
    },
    plugins: [
      postcss({
        extract: path.resolve('dist/apps/based/buddylist.css'),
        minimize: true,
        sourceMap: true
      })
    ]
  }
,
  {
    input: 'apps/based/buddyscript/buddyscript.js',
    output: {
      file: 'dist/apps/based/buddyscript.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/camera/camera.js',
    output: {
      file: 'dist/apps/based/camera.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/camera/camera-style.js',
    output: {
      file: 'dist/dummy-css.js',
      format: 'es',
    },
    plugins: [
      postcss({
        extract: path.resolve('dist/apps/based/camera.css'),
        minimize: true,
        sourceMap: true
      })
    ]
  }
,
  {
    input: 'apps/based/card/card.js',
    output: {
      file: 'dist/apps/based/card.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/chalkboard/chalkboard.js',
    output: {
      file: 'dist/apps/based/chalkboard.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/chess/chess.js',
    output: {
      file: 'dist/apps/based/chess.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/client/client.js',
    output: {
      file: 'dist/apps/based/client.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/clock/clock.js',
    output: {
      file: 'dist/apps/based/clock.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/coin/coin.js',
    output: {
      file: 'dist/apps/based/coin.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/coin/coin-style.js',
    output: {
      file: 'dist/dummy-css.js',
      format: 'es',
    },
    plugins: [
      postcss({
        extract: path.resolve('dist/apps/based/coin.css'),
        minimize: true,
        sourceMap: true
      })
    ]
  }
,
  {
    input: 'apps/based/console/console.js',
    output: {
      file: 'dist/apps/based/console.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/console/console-style.js',
    output: {
      file: 'dist/dummy-css.js',
      format: 'es',
    },
    plugins: [
      postcss({
        extract: path.resolve('dist/apps/based/console.css'),
        minimize: true,
        sourceMap: true
      })
    ]
  }
,
  {
    input: 'apps/based/desktop/desktop.js',
    output: {
      file: 'dist/apps/based/desktop.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/desktop/desktop-style.js',
    output: {
      file: 'dist/dummy-css.js',
      format: 'es',
    },
    plugins: [
      postcss({
        extract: path.resolve('dist/apps/based/desktop.css'),
        minimize: true,
        sourceMap: true
      })
    ]
  }
,
  {
    input: 'apps/based/dictate/dictate.js',
    output: {
      file: 'dist/apps/based/dictate.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/dictate/dictate-style.js',
    output: {
      file: 'dist/dummy-css.js',
      format: 'es',
    },
    plugins: [
      postcss({
        extract: path.resolve('dist/apps/based/dictate.css'),
        minimize: true,
        sourceMap: true
      })
    ]
  }
,
  {
    input: 'apps/based/droparea/droparea.js',
    output: {
      file: 'dist/apps/based/droparea.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/editor-monaco/editor-monaco.js',
    output: {
      file: 'dist/apps/based/editor-monaco.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/editor-monaco/editor-monaco-style.js',
    output: {
      file: 'dist/dummy-css.js',
      format: 'es',
    },
    plugins: [
      postcss({
        extract: path.resolve('dist/apps/based/editor-monaco.css'),
        minimize: true,
        sourceMap: true
      })
    ]
  }
,
  {
    input: 'apps/based/emoji-picker/emoji-picker.js',
    output: {
      file: 'dist/apps/based/emoji-picker.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/emulator/emulator.js',
    output: {
      file: 'dist/apps/based/emulator.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/entity/entity.js',
    output: {
      file: 'dist/apps/based/entity.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/error-tracker/error-tracker.js',
    output: {
      file: 'dist/apps/based/error-tracker.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/eth/eth.js',
    output: {
      file: 'dist/apps/based/eth.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/fetch-in-webworker/fetch-in-webworker.js',
    output: {
      file: 'dist/apps/based/fetch-in-webworker.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/file-explorer/file-explorer.js',
    output: {
      file: 'dist/apps/based/file-explorer.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/file-explorer/file-explorer-style.js',
    output: {
      file: 'dist/dummy-css.js',
      format: 'es',
    },
    plugins: [
      postcss({
        extract: path.resolve('dist/apps/based/file-explorer.css'),
        minimize: true,
        sourceMap: true
      })
    ]
  }
,
  {
    input: 'apps/based/file-tree/file-tree.js',
    output: {
      file: 'dist/apps/based/file-tree.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/file-tree/file-tree-style.js',
    output: {
      file: 'dist/dummy-css.js',
      format: 'es',
    },
    plugins: [
      postcss({
        extract: path.resolve('dist/apps/based/file-tree.css'),
        minimize: true,
        sourceMap: true
      })
    ]
  }
,
  {
    input: 'apps/based/file-viewer/file-viewer.js',
    output: {
      file: 'dist/apps/based/file-viewer.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/file-viewer/file-viewer-style.js',
    output: {
      file: 'dist/dummy-css.js',
      format: 'es',
    },
    plugins: [
      postcss({
        extract: path.resolve('dist/apps/based/file-viewer.css'),
        minimize: true,
        sourceMap: true
      })
    ]
  }
,
  {
    input: 'apps/based/fingerpaint/fingerpaint.js',
    output: {
      file: 'dist/apps/based/fingerpaint.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/fingerpaint/fingerpaint-style.js',
    output: {
      file: 'dist/dummy-css.js',
      format: 'es',
    },
    plugins: [
      postcss({
        extract: path.resolve('dist/apps/based/fingerpaint.css'),
        minimize: true,
        sourceMap: true
      })
    ]
  }
,
  {
    input: 'apps/based/fluid-simulation/fluid-simulation.js',
    output: {
      file: 'dist/apps/based/fluid-simulation.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/form/form.js',
    output: {
      file: 'dist/apps/based/form.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/frvr-basketball/frvr-basketball.js',
    output: {
      file: 'dist/apps/based/frvr-basketball.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/frvr-bowlingo/frvr-bowlingo.js',
    output: {
      file: 'dist/apps/based/frvr-bowlingo.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/frvr-greed/frvr-greed.js',
    output: {
      file: 'dist/apps/based/frvr-greed.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/frvr-kittenforce/frvr-kittenforce.js',
    output: {
      file: 'dist/apps/based/frvr-kittenforce.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/gamblor/gamblor.js',
    output: {
      file: 'dist/apps/based/gamblor.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/game/game.js',
    output: {
      file: 'dist/apps/based/game.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/globe/globe.js',
    output: {
      file: 'dist/apps/based/globe.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/hacker-typer/hacker-typer.js',
    output: {
      file: 'dist/apps/based/hacker-typer.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/help/help.js',
    output: {
      file: 'dist/apps/based/help.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/help/help-style.js',
    output: {
      file: 'dist/dummy-css.js',
      format: 'es',
    },
    plugins: [
      postcss({
        extract: path.resolve('dist/apps/based/help.css'),
        minimize: true,
        sourceMap: true
      })
    ]
  }
,
  {
    input: 'apps/based/hex-editor/hex-editor.js',
    output: {
      file: 'dist/apps/based/hex-editor.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/image-search/image-search.js',
    output: {
      file: 'dist/apps/based/image-search.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/image-search/image-search-style.js',
    output: {
      file: 'dist/dummy-css.js',
      format: 'es',
    },
    plugins: [
      postcss({
        extract: path.resolve('dist/apps/based/image-search.css'),
        minimize: true,
        sourceMap: true
      })
    ]
  }
,
  {
    input: 'apps/based/jutsu-caster/jutsu-caster.js',
    output: {
      file: 'dist/apps/based/jutsu-caster.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/jutsu-caster/jutsu-caster-style.js',
    output: {
      file: 'dist/dummy-css.js',
      format: 'es',
    },
    plugins: [
      postcss({
        extract: path.resolve('dist/apps/based/jutsu-caster.css'),
        minimize: true,
        sourceMap: true
      })
    ]
  }
,
  {
    input: 'apps/based/localstorage/localstorage.js',
    output: {
      file: 'dist/apps/based/localstorage.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/mantra/mantra.js',
    output: {
      file: 'dist/apps/based/mantra.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/maps/maps.js',
    output: {
      file: 'dist/apps/based/maps.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/marbleblast/marbleblast.js',
    output: {
      file: 'dist/apps/based/marbleblast.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/markup/markup.js',
    output: {
      file: 'dist/apps/based/markup.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/menubar/menubar.js',
    output: {
      file: 'dist/apps/based/menubar.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/menubar/menubar-style.js',
    output: {
      file: 'dist/dummy-css.js',
      format: 'es',
    },
    plugins: [
      postcss({
        extract: path.resolve('dist/apps/based/menubar.css'),
        minimize: true,
        sourceMap: true
      })
    ]
  }
,
  {
    input: 'apps/based/minesweeper/minesweeper.js',
    output: {
      file: 'dist/apps/based/minesweeper.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/minipaint/minipaint.js',
    output: {
      file: 'dist/apps/based/minipaint.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/motd/motd.js',
    output: {
      file: 'dist/apps/based/motd.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/motd/motd-style.js',
    output: {
      file: 'dist/dummy-css.js',
      format: 'es',
    },
    plugins: [
      postcss({
        extract: path.resolve('dist/apps/based/motd.css'),
        minimize: true,
        sourceMap: true
      })
    ]
  }
,
  {
    input: 'apps/based/orderbook/orderbook.js',
    output: {
      file: 'dist/apps/based/orderbook.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/orderbook/orderbook-style.js',
    output: {
      file: 'dist/dummy-css.js',
      format: 'es',
    },
    plugins: [
      postcss({
        extract: path.resolve('dist/apps/based/orderbook.css'),
        minimize: true,
        sourceMap: true
      })
    ]
  }
,
  {
    input: 'apps/based/pad/pad.js',
    output: {
      file: 'dist/apps/based/pad.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/pad/pad-style.js',
    output: {
      file: 'dist/dummy-css.js',
      format: 'es',
    },
    plugins: [
      postcss({
        extract: path.resolve('dist/apps/based/pad.css'),
        minimize: true,
        sourceMap: true
      })
    ]
  }
,
  {
    input: 'apps/based/paint/paint.js',
    output: {
      file: 'dist/apps/based/paint.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/painterro/painterro.js',
    output: {
      file: 'dist/apps/based/painterro.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/patatap/patatap.js',
    output: {
      file: 'dist/apps/based/patatap.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/piano/piano.js',
    output: {
      file: 'dist/apps/based/piano.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/pincode/pincode.js',
    output: {
      file: 'dist/apps/based/pincode.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/pincode/pincode-style.js',
    output: {
      file: 'dist/dummy-css.js',
      format: 'es',
    },
    plugins: [
      postcss({
        extract: path.resolve('dist/apps/based/pincode.css'),
        minimize: true,
        sourceMap: true
      })
    ]
  }
,
  {
    input: 'apps/based/play/play.js',
    output: {
      file: 'dist/apps/based/play.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/plays-doodle-jump-extra/plays-doodle-jump-extra.js',
    output: {
      file: 'dist/apps/based/plays-doodle-jump-extra.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/plays-malpek/plays-malpek.js',
    output: {
      file: 'dist/apps/based/plays-malpek.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/pond/pond.js',
    output: {
      file: 'dist/apps/based/pond.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/pond/pond-style.js',
    output: {
      file: 'dist/dummy-css.js',
      format: 'es',
    },
    plugins: [
      postcss({
        extract: path.resolve('dist/apps/based/pond.css'),
        minimize: true,
        sourceMap: true
      })
    ]
  }
,
  {
    input: 'apps/based/portfolio/portfolio.js',
    output: {
      file: 'dist/apps/based/portfolio.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/portfolio/portfolio-style.js',
    output: {
      file: 'dist/dummy-css.js',
      format: 'es',
    },
    plugins: [
      postcss({
        extract: path.resolve('dist/apps/based/portfolio.css'),
        minimize: true,
        sourceMap: true
      })
    ]
  }
,
  {
    input: 'apps/based/powerlevel/powerlevel.js',
    output: {
      file: 'dist/apps/based/powerlevel.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/powerlevel/powerlevel-style.js',
    output: {
      file: 'dist/dummy-css.js',
      format: 'es',
    },
    plugins: [
      postcss({
        extract: path.resolve('dist/apps/based/powerlevel.css'),
        minimize: true,
        sourceMap: true
      })
    ]
  }
,
  {
    input: 'apps/based/profile/profile.js',
    output: {
      file: 'dist/apps/based/profile.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/profile/profile-style.js',
    output: {
      file: 'dist/dummy-css.js',
      format: 'es',
    },
    plugins: [
      postcss({
        extract: path.resolve('dist/apps/based/profile.css'),
        minimize: true,
        sourceMap: true
      })
    ]
  }
,
  {
    input: 'apps/based/ramblor/ramblor.js',
    output: {
      file: 'dist/apps/based/ramblor.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/ramblor/ramblor-style.js',
    output: {
      file: 'dist/dummy-css.js',
      format: 'es',
    },
    plugins: [
      postcss({
        extract: path.resolve('dist/apps/based/ramblor.css'),
        minimize: true,
        sourceMap: true
      })
    ]
  }
,
  {
    input: 'apps/based/resource/resource.js',
    output: {
      file: 'dist/apps/based/resource.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/rewards/rewards.js',
    output: {
      file: 'dist/apps/based/rewards.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/sampler/sampler.js',
    output: {
      file: 'dist/apps/based/sampler.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/sampler/sampler-style.js',
    output: {
      file: 'dist/dummy-css.js',
      format: 'es',
    },
    plugins: [
      postcss({
        extract: path.resolve('dist/apps/based/sampler.css'),
        minimize: true,
        sourceMap: true
      })
    ]
  }
,
  {
    input: 'apps/based/sandspiel/sandspiel.js',
    output: {
      file: 'dist/apps/based/sandspiel.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/say/say.js',
    output: {
      file: 'dist/apps/based/say.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/screen-recorder/screen-recorder.js',
    output: {
      file: 'dist/apps/based/screen-recorder.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/screen-recorder/screen-recorder-style.js',
    output: {
      file: 'dist/dummy-css.js',
      format: 'es',
    },
    plugins: [
      postcss({
        extract: path.resolve('dist/apps/based/screen-recorder.css'),
        minimize: true,
        sourceMap: true
      })
    ]
  }
,
  {
    input: 'apps/based/sequencer/sequencer.js',
    output: {
      file: 'dist/apps/based/sequencer.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/sigil-caster/sigil-caster.js',
    output: {
      file: 'dist/apps/based/sigil-caster.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/sigil-caster/sigil-caster-style.js',
    output: {
      file: 'dist/dummy-css.js',
      format: 'es',
    },
    plugins: [
      postcss({
        extract: path.resolve('dist/apps/based/sigil-caster.css'),
        minimize: true,
        sourceMap: true
      })
    ]
  }
,
  {
    input: 'apps/based/solitaire/solitaire.js',
    output: {
      file: 'dist/apps/based/solitaire.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/soundcloud/soundcloud.js',
    output: {
      file: 'dist/apps/based/soundcloud.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/soundrecorder/soundrecorder.js',
    output: {
      file: 'dist/apps/based/soundrecorder.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/spellbook/spellbook.js',
    output: {
      file: 'dist/apps/based/spellbook.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/spellbook/spellbook-style.js',
    output: {
      file: 'dist/dummy-css.js',
      format: 'es',
    },
    plugins: [
      postcss({
        extract: path.resolve('dist/apps/based/spellbook.css'),
        minimize: true,
        sourceMap: true
      })
    ]
  }
,
  {
    input: 'apps/based/stickman/stickman.js',
    output: {
      file: 'dist/apps/based/stickman.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/stickman/stickman-style.js',
    output: {
      file: 'dist/dummy-css.js',
      format: 'es',
    },
    plugins: [
      postcss({
        extract: path.resolve('dist/apps/based/stickman.css'),
        minimize: true,
        sourceMap: true
      })
    ]
  }
,
  {
    input: 'apps/based/stripe/stripe.js',
    output: {
      file: 'dist/apps/based/stripe.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/system/system.js',
    output: {
      file: 'dist/apps/based/system.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/themes/themes.js',
    output: {
      file: 'dist/apps/based/themes.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/toastr/toastr.js',
    output: {
      file: 'dist/apps/based/toastr.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/ui/ui.js',
    output: {
      file: 'dist/apps/based/ui.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/ui/ui-style.js',
    output: {
      file: 'dist/dummy-css.js',
      format: 'es',
    },
    plugins: [
      postcss({
        extract: path.resolve('dist/apps/based/ui.css'),
        minimize: true,
        sourceMap: true
      })
    ]
  }
,
  {
    input: 'apps/based/user-profile/user-profile.js',
    output: {
      file: 'dist/apps/based/user-profile.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/user-profile/user-profile-style.js',
    output: {
      file: 'dist/dummy-css.js',
      format: 'es',
    },
    plugins: [
      postcss({
        extract: path.resolve('dist/apps/based/user-profile.css'),
        minimize: true,
        sourceMap: true
      })
    ]
  }
,
  {
    input: 'apps/based/videochat/videochat.js',
    output: {
      file: 'dist/apps/based/videochat.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/videochat/videochat-style.js',
    output: {
      file: 'dist/dummy-css.js',
      format: 'es',
    },
    plugins: [
      postcss({
        extract: path.resolve('dist/apps/based/videochat.css'),
        minimize: true,
        sourceMap: true
      })
    ]
  }
,
  {
    input: 'apps/based/vision-harp/vision-harp.js',
    output: {
      file: 'dist/apps/based/vision-harp.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/vision-harp/vision-harp-style.js',
    output: {
      file: 'dist/dummy-css.js',
      format: 'es',
    },
    plugins: [
      postcss({
        extract: path.resolve('dist/apps/based/vision-harp.css'),
        minimize: true,
        sourceMap: true
      })
    ]
  }
,
  {
    input: 'apps/based/wallpaper/wallpaper.js',
    output: {
      file: 'dist/apps/based/wallpaper.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
,
  {
    input: 'apps/based/youtube/youtube.js',
    output: {
      file: 'dist/apps/based/youtube.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ]
  }
];
