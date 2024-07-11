import { fileURLToPath } from 'node:url'
import { createServer,preview } from 'vite'
import path from 'node:path'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const server = await createServer({
  // 任何合法的用户配置选项，加上 `mode` 和 `configFile`
    configFile: path.resolve(__dirname,'../vite.config.ts'), // 基础配置文件,合并规则
    root: path.resolve(__dirname, '../'),
    server: {
        port: 5000,
        host: '0.0.0.0',
        open: '/',
    },
  
})
await server.listen()

server.printUrls()
server.bindCLIShortcuts({ print: true })
