const { defineConfigWithVueTs, vueTsConfigs } = require('@vue/eslint-config-typescript')
const skipFormatting = require('@vue/eslint-config-prettier/skip-formatting')

module.exports = defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,cjs,mjs,ts,cts,mts,jsx,tsx,vue}'],
  },
  {
    name: 'app/ignores',
    ignores: ['dist', 'dist-ssr', 'coverage', 'node_modules', 'public', 'src/note', 'eslint.config.js'],
  },
  vueTsConfigs.recommended,
  skipFormatting,
)
