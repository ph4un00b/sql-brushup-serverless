// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

/** @type {import("eslint").Linter.Config} */
const config = {
  overrides: [
    {
      extends: [
        "eslint:recommended",
        "plugin:react-hooks/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
      ],
      files: ["*.ts", "*.tsx"],
      parserOptions: {
        project: path.join(__dirname, "tsconfig.json"),
      },
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: path.join(__dirname, "tsconfig.json"),
  },
  plugins: ["react", "@typescript-eslint", "react-hooks"],
  extends: ["next/core-web-vitals", "plugin:@typescript-eslint/recommended"],
  rules: {
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      {
        prefer: "type-imports",
        fixStyle: "inline-type-imports",
      },
    ],
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "double"],
    semi: ["error", "always"],
    eqeqeq: ["off", "smart"],
    "react/no-unescaped-entities": ["warn", { forbid: ["'"] }],
    "react-hooks/exhaustive-deps": "error",
    "prettier/prettier": ["off"],
    "import/order": ["error"],
    "no-return-await": "error",
    "no-labels": ["off"],
    "no-unused-labels": ["error"],
    "@typescript-eslint/ban-ts-comment": ["off"],
    "@typescript-eslint/no-var-requires": ["error"],
    "@typescript-eslint/no-non-null-assertion": "off",
  },
};

module.exports = config;
