/** @type {import("prettier").Config} */
export default {
  printWidth: 100,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  plugins: ["prettier-plugin-astro", "prettier-plugin-tailwindcss"],
  overrides: [
    {
      files: ["*.toml", "*.yml"],
      options: {
        useTabs: false,
      },
    },
    {
      files: ["*.mdx", "*.md"],
      options: {
        printWidth: 80,
      },
    },
    {
      files: ["**/*.astro"],
      options: {
        parser: "astro",
      },
    },
  ],
}
