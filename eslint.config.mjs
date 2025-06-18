import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules:{
        "react/jsx-no-bind": "off",
        "arrow-spacing": ["error", {
            before: true,
            after: true 
        }],
        "no-confusing-arrow": [
            "error",
            {allowParens: true,},
        ],
        "no-var": "error",
        "prefer-const": [
            "error",
            {
                destructuring: "any",
                ignoreReadBeforeAssign: true,
            },
        ],
        "no-const-assign": "error",
        "react/react-in-jsx-scope": "off",
        "@typescript-eslint/no-unused-vars": "warn",
        "no-plusplus": "off",
        "@typescript-eslint/no-shadow": "off",
        "@typescript-eslint/quotes": "off",
        "no-param-reassign": "off",
        "import/extensions": "off",
        "import/prefer-default-export": "off",
        "react/jsx-props-no-spreading": "off",
        "react-hooks/exhaustive-deps": "off",
        "no-multiple-empty-lines": ["error", { max: 1 }],
        "react/no-unused-prop-types": "warn",
        "@typescript-eslint/no-require-imports": "warn",
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/ban-ts-comment": "warn",
        "object-property-newline": [
            "error",
            { allowAllPropertiesOnSameLine: false },
        ],
        "react/jsx-one-expression-per-line": [1, { allow: "single-child" }],
        "@stylistic/jsx/jsx-max-props-per-line": [1, { "when": "always" }],
        "@stylistic/jsx/curly-newline": ["error", { 
            "multiline": true,
            "minElements": 2,
            "consistent": true }],
        "@stylistic/jsx/indent": "error",
        "@stylistic/jsx/brace-style": "error",
        "@stylistic/jsx/semi": ["error", "always"],
        "@stylistic/jsx/quotes": ["error", "double"],
        "@stylistic/jsx/jsx-closing-bracket-location": [1, "line-aligned"],
        "@stylistic/jsx/padding-line-between-statements": [
            "error",
            {
                blankLine: "always",
                prev: ["*"],
                next: "return" 
            },
            {
                blankLine: "always",
                prev: ["*"],
                next: "continue" 
            },
            {
                blankLine: "always",
                prev: ["*"],
                next: "if" 
            },
            {
                blankLine: "always",
                prev: ["*"],
                next: "break" 
            },
            {
                blankLine: "always",
                prev: ["while"],
                next: "*" 
            },
            {
                blankLine: "always",
                prev: ["*"],
                next: "while" 
            },
            {
                blankLine: "always",
                prev: ["*"],
                next: "switch" 
            },
            {
                blankLine: "always",
                prev: ["switch"],
                next: "*" 
            },
            {
                blankLine: "always",
                prev: ["if"],
                next: "*" 
            },
        ],
    },
}
];

export default eslintConfig;
