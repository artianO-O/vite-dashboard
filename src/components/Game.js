// 面板对象
const size = 6
const boxSize = 750

function nextTick() {
  return new Promise((resolve) => {
    Promise.resolve().then(() => {
      setTimeout(() => {
        resolve()
      }, 1)
    })
  })
}
class Board {
  score = 0
  square = []
  scoring = false
  candyCounter = 0
  flag = false
  swap = []
  fromCandy = null
  mouse_poi = {}
  boardSize = size
  isBack = false
  poiSquare = []
  constructor() {
    this.square = new Array(size)
    for (var i = 0; i <= size; i++) {
      this.square[i] = []
    }
    this.scoring = false
  }
  toString() {
    console.log('当前棋局')
    return this.square
      .map((row) => row.map((candy) => `${candy.id}`.padStart(2, 0)).join(' '))
      .join('\n')
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
  async swapCandies() {
    if (this.flag) return
    this.flag = true
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
      await nextTick()
      // 让vue分离数据操作与DOM操作
      this.DomMoveTo({ candy: this.square[row0][col0], toRow: row0, toCol: col0 })
      await this.DomMoveTo({ candy: this.square[row1][col1], toRow: row1, toCol: col1 })
    }
    // 数据交换后,产生可销毁元素,需要等交换的动画结束后才执行
    while (1) {
      const crushable = this.getCandyCrushes()
      console.log('可销毁元素', crushable)
      if (crushable.length == 0) break
      this.removeCrushes(crushable)
      await nextTick()
      this.moveCandiesDown()
      console.log(this.toString())
    }
    this.flag = false
  }
  // 移动糖果到指定位置
  moveTo(candy, toRow, toCol) {
    if (this.isEmptyLocation(toRow, toCol)) {
      var details = {
        candy: candy,
        toRow: toRow,
        toCol: toCol,
        fromRow: candy.row,
        fromCol: candy.col
      }

      delete this.square[candy.row][candy.col]
      this.square[toRow][toCol] = candy

      candy.row = toRow
      candy.col = toCol

      this.DomMoveTo(details)
    }
  }
  // Dom操作移动糖果到指定位置
  async DomMoveTo({ candy, toRow, toCol }) {
    Object.assign(candy, {
      x: this.poiSquare[toRow][toCol].x,
      y: this.poiSquare[toRow][toCol].y
    })
    await new Promise((resolve, reject) => {
      candy.events = {
        transitionend: () => {
          // 过渡结束啦
          // this.flag = false
          // console.log('过渡结束啦')
          resolve()
        }
      }
    })
  }
  // 移除之后对糖果进行填充
  moveCandiesDown() {
    // Collapse each column
    for (var col = 0; col < this.boardSize; col++) {
      var emptyRow = null
      // In each column, scan for the bottom most empty row
      //在每一列中，扫描最下面的空行
      for (var emptyRow = this.boardSize - 1; emptyRow >= 0; emptyRow--) {
        if (this.getCandyAt(emptyRow, col) == null) {
          break
        }
      }
      // Then shift any nonempty rows up
      //然后向上移动任何非空行
      for (var row = emptyRow - 1; row >= 0; row--) {
        var candy = this.getCandyAt(row, col)
        if (candy != null) {
          this.moveTo(candy, emptyRow, col)
          emptyRow--
        }
      }

      // 填补空行
      for (var spawnRow = -1; emptyRow >= 0; emptyRow--, spawnRow--) {
        // We report spawnRow as the (negative) position where
        // the candy "would have" started to fall into place.
        this.addRandomCandy(emptyRow, col, spawnRow, col)
      }
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
    while (true) {
      // 初始化糖果面板
      this.populateBoard()
      // 查找所有可能的粉碎，返回一个糖果数组
      var crushable = this.getCandyCrushes()
      if (crushable.length == 0) break
      // // 根据糖果数组去粉碎目标
      this.removeCrushes(crushable)
    }
    this.poiSquare = this.square.map((item) => {
      return item.map((candy) => {
        return { x: candy.x, y: candy.y }
      })
    })
    console.log(this.poiSquare)
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
  findColorStrips(vertical, swap) {
    var getAt = (x, y) => {
      // Retrieve the candy at a row and column (depending on vertical)
      var result = vertical ? this.getCandyAt(y, x) : this.getCandyAt(x, y)
      if (swap) {
        // If the result candy is in the 'swap' array, then swap the
        // result with its adjacent pair.
        var index = swap.indexOf(result)
        if (index >= 0) return swap[index ^ 1]
      }
      return result
    }
    var result = []
    for (var j = 0; j < this.boardSize; j++) {
      for (var h, k = 0; k < this.boardSize; k = h) {
        // Scan for rows of same-colored candy starting at k
        var firstCandy = getAt(j, k)
        h = k + 1
        if (!firstCandy) continue
        var candies = [firstCandy]
        for (; h < this.boardSize; h++) {
          var lastCandy = getAt(j, h)
          if (!lastCandy || lastCandy.color != firstCandy.color) break
          candies.push(lastCandy)
        }
        // If there are at least 3 candies in a row, remember the set.
        if (candies.length >= 3) result.push(candies)
      }
    }
    return result
  }

  // 获取所有可粉碎的糖果
  getCandyCrushes(swap) {
    var unioned = {}
    var sizes = {}
    var row, col
    function find(key) {
      var parent = unioned[key]
      if (parent == null) return key
      parent = find(parent)
      unioned[key] = parent // Path compression
      return parent
    }
    function size(found) {
      return sizes[found] || 1
    }
    function union(key1, key2) {
      var p1 = find(key1),
        p2 = find(key2)
      if (p1 == p2) return p1
      unioned[p2] = p1
      sizes[p1] = size(p1) + size(p2)
      delete sizes[p2]
    }
    // Get strips of length 3.
    var vert = this.findColorStrips(true, swap)
    var horiz = this.findColorStrips(false, swap)
    var sets = vert.concat(horiz)

    // Execute union of all the strips, possibly joining
    // horizontal and vertical strips that intersect.
    for (var j = 0; j < sets.length; j++) {
      var set = sets[j]
      for (var k = 1; k < set.length; k++) {
        union(set[0].id, set[k].id)
      }
    }

    // Pass 2: list out resulting sets of minSize or larger.
    var results = {}
    for (row = 0; row < this.boardSize; row++) {
      for (col = 0; col < this.boardSize; col++) {
        var candy = this.getCandyAt(row, col)
        if (candy) {
          var p = find(candy.id)
          if (size(p) >= 3) {
            if (!(p in results)) results[p] = []
            results[p].push(candy)
          }
        }
      }
    }
    // Pass 3: Return results as a list of list of candies.
    var list = []
    for (var key in results) {
      list.push(results[key])
    }
    return list
  }
  removeCrushes(setOfSetsOfCrushes) {
    for (var j = 0; j < setOfSetsOfCrushes.length; j++) {
      var set = setOfSetsOfCrushes[j]
      for (var k = 0; k < set.length; k++) {
        const candy = set[k]
        this.remove(candy)
        // this.DomMoveTo(candy)
      }
    }
  }
  async DomRemove(candy) {
    candy.classList = ['crush']
    await new Promise((resolve) => {
      candy.events = {
        animationend: () => {
          resolve()
          // this.remove(candy)
        }
      }
    })
  }
  // 数据上销毁元素
  remove(candy) {
    var details = {
      candy: candy,
      fromRow: candy.row,
      fromCol: candy.col
    }
    delete this.square[candy.row][candy.col]
    candy.row = candy.col = null
    // 需要设置离场动画
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
  this.events = {}
  this.classList = []

  this.toString = function () {
    var name = this.color
    return name
  }
}
// 糖果颜色数组
Candy.colors = ['red', 'yellow', 'green', 'orange', 'blue', 'purple']

export { Board }
