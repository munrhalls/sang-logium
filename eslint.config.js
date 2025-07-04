import next from "eslint-config-next";
import prettier from "eslint-config-prettier";

export default [
  next({
    coreWebVitals: true,
    typescript: true,
  }),
  prettier,
  {
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
];
