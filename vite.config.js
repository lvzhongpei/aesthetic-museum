import { defineConfig } from 'vite';

/**
 * base 的判断依据是 mode，不是 command。
 *
 * 坑在这里：`vite preview` 传入的 command 是 'serve'，和 `vite dev` 一样，
 * 所以用 command === 'build' 来判断，preview 会拿到 base '/'，
 * 而构建产物里写的是 '/aesthetic-museum/assets/...' —— 结果每个资源都 404
 * 并被 SPA 兜底成 index.html，浏览器把 HTML 当模块解析，页面永远停在载入屏。
 *
 * mode 在 dev 下是 'development'，在 build 和 preview 下都是 'production'，
 * 用它判断两个阶段才都正确。
 */
export default defineConfig(({ mode }) => ({
  base: mode === 'development' ? '/' : '/aesthetic-museum/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    target: 'es2020',
    chunkSizeWarningLimit: 1200,
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
  },
}));
