// 面板对象
const size = 8
const boxSize = 600
class Board {
  score = 0
  square = []
  scoring = false
  candyCounter = 0
  constructor() {
    this.square = new Array(size)
    for (var i = 0; i <= size; i++) {
      this.square[i] = []
    }
  }
  getSize() {
    return size
  }
  // 获取指定位置糖果
  getCandyAt(row, col) {
    if (this.isValidLocation(row, col)) {
      return this.square[row][col]
    }
  }
  isValidLocation(row, col) {
    return (
      row >= 0 &&
      col >= 0 &&
      row <= size &&
      col <= size &&
      row == Math.round(row) &&
      col == Math.round(col)
    )
  }
  isEmptyLocation(row, col) {
    if (this.getCandyAt(row, col)) {
      return false
    }
    return true
  }
  getAllCandies() {
    var results = []
    for (var r in this.square) {
      for (var c in this.square[r]) {
        if (this.square[r][c]) {
          results.push(this.square[r][c])
        }
      }
    }
    return results
  }
  //  添加糖果
  add(candy, row, col) {
    if (this.isEmptyLocation(row, col)) {
      candy.row = row
      candy.col = col
      candy.width = boxSize / size
      candy.height = boxSize / size
      const candySize = candy.width
      candy.r = candySize / 2
      candy.x = (col - 1) * candySize + candySize / 2
      candy.y = (row - 1) * candySize + candySize / 2

      this.square[row][col] = candy
    } else {
      console.log('add already found a candy at ' + row + ',' + col)
    }
  }
  addRandomCandy(row, col, spawnRow, spawnCol) {
    var random_color = Math.floor(Math.random() * Candy.colors.length)
    // 初始化其对应位置
    var candy = new Candy(Candy.colors[random_color], this.candyCounter++)
    this.add(candy, row, col, spawnRow, spawnCol)
  }
  populateBoard() {
    for (var col = 0; col < size; col++) {
      for (var row = 0; row < size; row++) {
        // Check the empty candy position (hole), fill with new candy
        if (this.getCandyAt(row, col) == null) {
          this.addRandomCandy(row, col)
        }
      }
    }
  }
  prepareNewGame() {
    this.scoring = false
    this.populateBoard()
    // while (true) {
    //   // 初始化糖果面板
    //   this.populateBoard()
    //   // 查找所有可能的粉碎，返回一个糖果数组
    //   // var crushable = this.getCandyCrushes()
    //   // if (crushable.length == 0) break
    //   // // 根据糖果数组去粉碎目标
    //   // this.removeCrushes(crushable)
    // }
    this.scoring = true
  }
}

// Candy游戏对象，负责存储颜色，位置，id等数据
const Candy = function (color, id) {
  Object.defineProperty(this, 'color', { value: color, writable: false })
  Object.defineProperty(this, 'id', { value: id, writable: false })

  this.row = null
  this.col = null
  this.x = 0
  this.y = 0
  this.width = 0
  this.height = 0

  this.toString = function () {
    var name = this.color
    return name
  }
}
// 糖果颜色数组
Candy.colors = ['red', 'yellow', 'green', 'orange', 'blue', 'purple']

export { Board }
