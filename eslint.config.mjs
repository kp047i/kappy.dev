import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";
import storybook from "eslint-plugin-storybook";

const eslintConfig = [
  ...nextVitals,
  ...nextTypeScript,
  ...storybook.configs["flat/recommended"],
  prettier,
  {
    files: ["**/*.{js,jsx,mjs,ts,tsx,mts,cts}"],
    rules: {
      "import/order": [
        "error",
        {
          groups: [["builtin", "external"], ["parent", "sibling", "index"], "internal"],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "storybook-static/**",
      "playwright-report/**",
      "test-results/**",
    ],
  },
];

export default eslintConfig;
