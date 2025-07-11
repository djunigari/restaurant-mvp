import { FlatCompat } from "@eslint/eslintrc"
import tsParser from "@typescript-eslint/parser"
import { dirname } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

export default [
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
    },
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    ignores: [
      "node_modules/",
      ".next/",
      "dist/",
      "build/",
      "out/",
      "prisma/",
      "src/generated/",
    ],
    ...compat.extends("next/core-web-vitals", "next/typescript")[0],
    rules: {
      "react/react-in-jsx-scope": "off",
    },
  },
]
