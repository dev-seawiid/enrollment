import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettierConfig from 'eslint-config-prettier';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Disable ESLint formatting rules that conflict with Prettier.
  // Must come after all other configs.
  prettierConfig,
  {
    rules: {
      // --- TypeScript ---
      // 'any' 사용 시 경고 (완전 금지는 개발 초기에 너무 엄격)
      '@typescript-eslint/no-explicit-any': 'warn',
      // type-only import는 'import type'으로 강제 → 번들 사이즈 최적화
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      // 미사용 변수는 에러, 단 '_' 접두사는 허용
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      // --- React ---
      // 자식 없는 컴포넌트는 self-closing으로 작성 (<Foo /> 형태)
      'react/self-closing-comp': 'warn',
      // 배열 index를 key로 사용하면 불필요한 리렌더링 발생 가능
      'react/no-array-index-key': 'warn',

      // --- General ---
      // console.log 는 경고, console.warn/error 는 허용
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      // var 대신 const/let 강제
      'prefer-const': 'error',
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
]);

export default eslintConfig;
