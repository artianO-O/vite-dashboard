// plane / assets_script.js
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(new URL(import.meta.url))
const __dirname = path.dirname(__filename)

const assetsList = fs.readdirSync(path.resolve(__dirname, '../assets/fly'))

const assetsMap = {}
assetsList.forEach((item) => {
  // 修改正则表达式以正确提取文件名前缀
  const key = item.match(/^[^.]+/)[0]
  assetsMap[key] = `../assets/fly/${item}`
})

fs.writeFileSync(path.resolve(__dirname, '../asset_map.json'), JSON.stringify(assetsMap, null, 2))
