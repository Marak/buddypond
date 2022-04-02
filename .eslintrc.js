module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "jquery": true,
    "es2021": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": "latest"
  },
  "rules": {
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "always"
    ],
    "no-var": "error",
    "no-unused-vars": [
      "error",
      {
        "args": "none"
      }
    ],
    "space-before-function-paren": "error",
    "keyword-spacing": [
      "error",
      {
        "before": true
      }
    ],
    "space-before-blocks": [
      "error"
    ],
    "key-spacing": [
      "error",
      {
        "mode": "minimum"
      }
    ],
    "object-curly-spacing": [
      "error",
      "always"
    ],
    "array-bracket-spacing": [
      "error",
      "always"
    ],
    "func-call-spacing": [
      "error",
      "never"
    ]
  },
  "globals": {
    "JQDX": true,
    "buddypond": true,
    "desktop": true,
    "isMobile": true,
    "forbiddenNotes": true,
    "GIF": true,
    "gifFrames": true,
    "DateFormat": true,
    "YT": true,
    "clippy": true,
    "DEFAULT_SNAP_TIMER": true,
    "currentFrame": true,
    "JSManipulate": true,
    "SC": true,
    "SimplePeer": true,
    "EmojiPicker": true
  }
}
