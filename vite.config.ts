import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      // 可以自定义文件生成的位置，默认是根目录下，使用 ts 的建议放 src 目录下
      dts: true,
      imports: ['vue', 'vue-router']
    })
  ],
  // 全局定义的变量
  define: {
    ENV: '111222'
  },
  // 全局路径别名配置
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, '../src')
    }
  }
})
