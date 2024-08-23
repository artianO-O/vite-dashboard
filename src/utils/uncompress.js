import fs from 'fs/promises'
import tinify from 'tinify'
import ora from 'ora'
import path from 'path'

// 设置 API 密钥
tinify.key = 'kMKByTljdmfS3wzXxD18PZStYmJfpZFP'

async function optimizeImagesInDirectory(directoryPath) {
  try {
    // 获取目录中的所有文件和子目录
    const entries = await fs.readdir(directoryPath, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(directoryPath, entry.name)

      if (entry.isDirectory()) {
        // 如果是目录，则递归调用
        await optimizeImagesInDirectory(fullPath)
      } else if (isSupportedImage(entry.name)) {
        // 如果是支持的图片文件，则进行优化
        await optimizeImage(fullPath)
      }
    }
  } catch (err) {
    console.error('Error processing directory:', err)
  }
}

async function optimizeImage(filePath) {
  try {
    // 读取文件
    const originalBuffer = await fs.readFile(filePath)
    const originalSize = originalBuffer.length

    // 创建加载指示器
    const spinner = ora(`Optimizing: ${filePath}`).start()

    // 从 Buffer 中读取图片并压缩
    const resultData = await tinify.fromBuffer(originalBuffer).toBuffer()

    // 停止加载指示器
    spinner.succeed(`Optimized: ${filePath}`)

    // 计算优化前后的大小差异
    const optimizedSize = resultData.length
    const sizeDifference = originalSize - optimizedSize
    const compressionRate = (1 - optimizedSize / originalSize) * 100

    // 判断是否值得优化
    if (shouldOptimize(sizeDifference, compressionRate)) {
      // 将压缩后的图片数据写回原文件
      await fs.writeFile(filePath, resultData)
      printOptimizationResult(filePath, originalSize, optimizedSize, compressionRate)
    } else {
      printOptimizationResult(filePath, originalSize, optimizedSize, compressionRate, false)
    }
  } catch (err) {
    spinner.fail(`Failed to optimize: ${filePath}`)
    console.error(`Error optimizing image ${filePath}:`, err)
  }
}

function isSupportedImage(filename) {
  const extension = path.extname(filename).toLowerCase()
  return ['.png', '.jpg', '.jpeg', '.webp'].includes(extension)
}

function shouldOptimize(sizeDifference, compressionRate) {
  // 设定阈值：如果文件大小减少至少 10 KB 或者压缩率至少为 5%，则认为值得优化
  const sizeThresholdKB = 10
  const compressionRateThreshold = 5

  return sizeDifference >= sizeThresholdKB * 1024 || compressionRate >= compressionRateThreshold
}

function formatSize(size) {
  if (size < 1024) {
    return `${size} B`
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`
  } else {
    return `${(size / (1024 * 1024)).toFixed(2)} MB`
  }
}

function ansiRed(text) {
  return `\x1b[31m${text}\x1b[0m`
}

function ansiGreen(text) {
  return `\x1b[32m${text}\x1b[0m`
}

function printOptimizationResult(
  filePath,
  originalSize,
  optimizedSize,
  compressionRate,
  isOptimized = true
) {
  if (isOptimized) {
    console.log(`${ansiGreen('Image optimized:')} ${filePath}`)
    console.log(`${ansiRed('Original size:')} ${formatSize(originalSize)}`)
    console.log(`${ansiGreen('Optimized size:')} ${formatSize(optimizedSize)}`)
    console.log(`${ansiGreen('Compression rate:')} ${compressionRate.toFixed(2)}%`)
  } else {
    console.log(`${ansiRed('No significant optimization gain for:')} ${filePath}`)
  }
}

// 从命令行参数中获取目录路径
let directoryPath = process.argv[2] || process.cwd()

// 执行优化
await optimizeImagesInDirectory(directoryPath)

// 获取账户信息
tinify.validate(function (err) {
  if (err) throw err
  const sumCompressionCount = 500 // 免费账号每月只有500次
  console.log(
    `Remaining optimizations this month: ${sumCompressionCount - tinify.compressionCount}`
  )
})
