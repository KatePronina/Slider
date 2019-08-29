module.exports = {
  "roots": [
    "<rootDir>/src"
  ],
  "transform": {
    "^.+\\.tsx?$": "ts-jest",
    "^.+\\.hbs$": "<rootDir>/node_modules/handlebars-jest"
  },
}