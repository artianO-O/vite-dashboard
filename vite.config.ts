import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const __dirname = fileURLToPath(new URL('.', import.meta.url))


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 全局定义的变量
  define: {
    ENV: '111222'
  },
  // 全局路径别名配置
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, '../src'),
    }
  },
})
