module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['import'],
    extends: 'typescript-airbnb-base',
    rules: {
        "import/no-unresolved": "error",
        "no-param-reassign": [2, { "props": false }]
    },
    "env": {
        "jquery": true
    }
  }