import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    languageOptions: { 
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021
      },
      ecmaVersion: 'latest'
    },
  },
  pluginJs.configs.recommended,
];
