import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPretter from 'eslint-config-prettier';

export default [
  { languageOptions: { globals: globals.node, } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPretter,
];