// 面板对象
const size = 7
const boxSize = 750
class Board {
  score = 0
  square = []
  scoring = false
  candyCounter = 0
  flag = false
  swap = []
  fromCandy = null
  mouse_poi = {}
  constructor() {
    this.square = new Array(size)
    for (var i = 0; i <= size; i++) {
      this.square[i] = []
    }
    this.scoring = false
  }
  getSize() {
    return size
  }
  getBoxSize() {
    return boxSize
  }
  // 获取指定位置糖果
  getCandyAt(row, col) {
    if (this.isValidLocation(row, col)) {
      // console.log(this.square)
      return this.square[row][col]
    }
  }
  // 交换位置
  swapCandies() {
    if (this.flag) return
    this.flag = true
    const swap = this.swap
    console.log(swap)
    const tempCandy = { ...swap[0] }
    // 除了行列之外，其他数据都得交换
    console.log(tempCandy)
    if (swap[0] && swap[1]) {
      const { row: row0, col: col0 } = swap[0]
      const { row: row1, col: col1 } = swap[1]
      // 第一步只交换位置信息
      Object.assign(this.square[row0][col0], {
        x: swap[1].x,
        y: swap[1].y
      })
      Object.assign(this.square[row1][col1], {
        x: tempCandy.x,
        y: tempCandy.y
      })
    }
  }
  // 交换数据
  swapData() {
    const swap = this.swap
    const tempCandy = { ...swap[0] }
    // 除了行列之外，其他数据都得交换
    console.log(tempCandy)
    if (swap[0] && swap[1]) {
      const { row: row0, col: col0 } = swap[0]
      const { row: row1, col: col1 } = swap[1]
      Object.assign(this.square[row0][col0], swap[1], {
        row: row0,
        col: col0
      })
      Object.assign(this.square[row1][col1], tempCandy, {
        row: row1,
        col: col1
      })
      this.swap = []
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
  getCandyInDirection(fromCandy, direction) {
    switch (direction) {
      case 'up': {
        return this.getCandyAt(fromCandy.row - 1, fromCandy.col)
      }
      case 'down': {
        return this.getCandyAt(fromCandy.row + 1, fromCandy.col)
      }
      case 'left': {
        return this.getCandyAt(fromCandy.row, fromCandy.col - 1)
      }
      case 'right': {
        return this.getCandyAt(fromCandy.row, fromCandy.col + 1)
      }
    }
  }
  getCandiesToCrushGivenMove(fromCandy, direction) {
    var toCandy = this.getCandyInDirection(fromCandy, direction)
    // console.log(fromCandy, direction)
    // console.log(toCandy)
    // || toCandy.color == fromCandy.color
    if (!toCandy) {
      return []
    }
    var swap = [fromCandy, toCandy]

    return swap

    // return [].concat.apply([], connected) //flatten nested lists
  }
}

// Candy游戏对象，负责存储颜色，位置，id等数据
const Candy = function (color, id) {
  // Object.defineProperty(this, 'color', { value: color, writable: true })
  // Object.defineProperty(this, 'id', { value: id, writable: true })

  this.color = color
  this.id = id
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
