// Board游戏面板，负责操控游戏记录分数，加分，加糖果，删除糖果，移动糖果等数据操作
const Board = function (size) {
  var candyCounter = 0
  this.score = 0
  this.boardSize = size
  this.square = new Array(this.boardSize)

  for (var i = 0; i <= this.boardSize; i++) {
    this.square[i] = []
  }

  // 判断位置是否有效
  this.isValidLocation = function (row, col) {
    return (
      row >= 0 &&
      col >= 0 &&
      row <= this.boardSize &&
      col <= this.boardSize &&
      row == Math.round(row) &&
      col == Math.round(col)
    )
  }

  // 判断是否为空位
  this.isEmptyLocation = function (row, col) {
    if (this.getCandyAt(row, col)) {
      return false
    }
    return true
  }

  // 自动移动
  this.doAutoMove = function () {
    var move = rules.getRandomValidMove()
    var toCandy = board.getCandyInDirection(move.candy, move.direction)
    this.flipCandies(move.candy, toCandy)
  }

  // 获取面板尺寸
  this.getSize = function () {
    return this.boardSize
  }

  // 获取指定位置糖果
  this.getCandyAt = function (row, col) {
    if (this.isValidLocation(row, col)) {
      return this.square[row][col]
    }
  }

  // 获取糖果位置
  this.getLocationOf = function (candy) {
    return { row: candy.row, col: candy.col }
  }

  // 获取所有的糖果，返回一维数组
  this.getAllCandies = function () {
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
  this.add = function (candy, row, col, spawnRow, spawnCol) {
    if (this.isEmptyLocation(row, col)) {
      var details = {
        candy: candy,
        toRow: row,
        toCol: col,
        fromRow: spawnRow,
        fromCol: spawnCol
      }

      candy.row = row
      candy.col = col

      this.square[row][col] = candy

      // 去操作dom事件
      $(this).triggerHandler('add', details)
    } else {
      console.log('add already found a candy at ' + row + ',' + col)
    }
  }

  // 移动糖果
  this.moveTo = function (candy, toRow, toCol) {
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

      $(this).triggerHandler('move', details)
    }
  }

  // 移除糖果
  this.remove = function (candy) {
    var details = {
      candy: candy,
      fromRow: candy.row,
      fromCol: candy.col
    }
    delete this.square[candy.row][candy.col]
    candy.row = candy.col = null
    $(this).triggerHandler('remove', details)
  }

  // 移除指定位置的糖果
  this.removeAt = function (row, col) {
    if (this.isEmptyLocation(row, col)) {
      console.log('removeAt found no candy at ' + row + ',' + col)
    } else {
      this.remove(this.square[row][col])
    }
  }

  // 清除糖果
  this.clear = function () {
    for (var r in this.square) {
      for (var c in this.square[r]) {
        if (this.square[r][c]) {
          this.removeAt(r, c)
        }
      }
    }
  }

  // 生成糖果并添加
  this.addCandy = function (color, row, col, spawnRow, spawnCol) {
    var candy = new Candy(color, candyCounter++)
    this.add(candy, row, col, spawnRow, spawnCol)
  }

  // 随机生成糖果
  this.addRandomCandy = function (row, col, spawnRow, spawnCol) {
    var random_color = Math.floor(Math.random() * Candy.colors.length)
    var candy = new Candy(Candy.colors[random_color], candyCounter++)
    this.add(candy, row, col, spawnRow, spawnCol)
  }

  // 获取某一糖果指定方向的糖果
  this.getCandyInDirection = function (fromCandy, direction) {
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

  // 交换翻转两个糖果
  this.flipCandies = function (candy1, candy2) {
    // Swap the two candies simultaneously.
    var details1 = {
      candy: candy1,
      toRow: candy2.row,
      toCol: candy2.col,
      fromRow: candy1.row,
      fromCol: candy1.col
    }
    var details2 = {
      candy: candy2,
      toRow: candy1.row,
      toCol: candy1.col,
      fromRow: candy2.row,
      fromCol: candy2.col
    }
    candy1.row = details1.toRow
    candy1.col = details1.toCol
    this.square[details1.toRow][details1.toCol] = candy1
    candy2.row = details2.toRow
    candy2.col = details2.toCol
    this.square[details2.toRow][details2.toCol] = candy2

    // Trigger two move events.
    $(this).triggerHandler('move', details1)
    $(this).triggerHandler('move', details2)
  }

  // 重置分数
  this.resetScore = function () {
    this.score = 0
    $(this).triggerHandler('scoreUpdate', [{ score: 0 }])
  }

  // 增加分数
  this.incrementScore = function (candy, row, col) {
    this.score += 1
    $(this).triggerHandler('scoreUpdate', [
      {
        score: this.score,
        candy: candy,
        row: row,
        col: col
      }
    ])
  }

  // 获取分数
  this.getScore = function () {
    return this.score
  }

  //  以字符串形式输出面板
  this.toString = function () {
    var result = ''
    for (var r = 0; r < this.boardSize; ++r) {
      for (var c = 0; c < this.boardSize; ++c) {
        var candy = this.square[r][c]
        if (candy) {
          result += candy.toString().charAt(0) + ' '
        } else {
          result += '_ '
        }
      }
      result += '<br/>'
    }
    return result.toString()
  }
}

// Candy游戏对象，负责存储颜色，位置，id等数据
const Candy = function (color, id) {
  Object.defineProperty(this, 'color', { value: color, writable: false })
  Object.defineProperty(this, 'id', { value: id, writable: false })

  this.row = null
  this.col = null

  this.toString = function () {
    var name = this.color
    return name
  }
}
// 糖果颜色数组
Candy.colors = ['red', 'yellow', 'green', 'orange', 'blue', 'purple']

//======================= rule.js迁移 =======================
const Rules = function (board) {
  var scoring = false
  // 初始化游戏的时候将所有糖果随机产生
  this.prepareNewGame = function () {
    scoring = false
    while (true) {
      // 初始化糖果面板
      this.populateBoard()
      // 查找所有可能的粉碎，返回一个糖果数组
      var crushable = this.getCandyCrushes()
      if (crushable.length == 0) break
      // 根据糖果数组去粉碎目标
      this.removeCrushes(crushable)
    }
    scoring = true
  }

  /*返回true如果翻转从糖果与糖果的方向
   *指定（['上'，'下'，'左'，'右']）有效
   *（根据规则），否则返回false。
   */
  this.isMoveTypeValid = function (fromCandy, direction) {
    return this.numberCandiesCrushedByMove(fromCandy, direction) > 0
  }
  /*
   *
   *返回板上所有糖果粉碎的列表。糖果粉碎是
   *单行或单列中包含三个或更多糖果的列表
   *相同的颜色。每次粉碎都作为糖果列表提供
   *粉碎，产生列表列表。此方法的输出应
   *直接传递到this. RemoveCrush以删除糖果粉碎。
   * 返回所有糖果粉碎的列表
   *
   */
  this.getCandyCrushes = function (swap) {
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
    for (row = 0; row < board.boardSize; row++) {
      for (col = 0; col < board.boardSize; col++) {
        var candy = board.getCandyAt(row, col)
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
  this.removeCrushes = function (setOfSetsOfCrushes) {
    for (var j = 0; j < setOfSetsOfCrushes.length; j++) {
      var set = setOfSetsOfCrushes[j]
      for (var k = 0; k < set.length; k++) {
        if (scoring) board.incrementScore(set[k], set[k].row, set[k].col)
        board.remove(set[k])
      }
    }
  }
  /*
   *将糖果向下移动到有空位的地方。
   *board. moveTo，生成要侦听的“移动”事件。如果有
   *是通过向下移动糖果创建的孔，填充孔
   *随机糖果，并为这些糖果发出“添加”事件。
   */
  this.moveCandiesDown = function () {
    // Collapse each column
    for (var col = 0; col < board.boardSize; col++) {
      var emptyRow = null
      // In each column, scan for the bottom most empty row
      //在每一列中，扫描最下面的空行
      for (var emptyRow = board.boardSize - 1; emptyRow >= 0; emptyRow--) {
        if (board.getCandyAt(emptyRow, col) == null) {
          break
        }
      }
      // Then shift any nonempty rows up
      //然后向上移动任何非空行
      for (var row = emptyRow - 1; row >= 0; row--) {
        var candy = board.getCandyAt(row, col)
        if (candy != null) {
          board.moveTo(candy, emptyRow, col)
          emptyRow--
        }
      }

      // 填补空行
      for (var spawnRow = -1; emptyRow >= 0; emptyRow--, spawnRow--) {
        // We report spawnRow as the (negative) position where
        // the candy "would have" started to fall into place.
        board.addRandomCandy(emptyRow, col, spawnRow, col)
      }
    }
  }
  /*
   *
   *如果有有效的移动，则返回一个具有两个属性的对象：
   *糖果：可以移动的糖果
   *方向：它可以移动的方向。
   *如果没有有效的动作，则返回null。移动被选中
   *从可用的动作中随机选择，偏爱较小粉碎的动作。
   *
   */
  this.getRandomValidMove = function () {
    var directions = ['up', 'down', 'left', 'right']
    var validMovesThreeCrush = []
    var validMovesMoreThanThreeCrush = []
    //对于板中的每个单元格，检查是否将其移入
    //四个方向中的任何一个都会导致挤压
    //如果是，将其添加到适当的列表中（validMoves_threeCrush
    //3号的粉碎，validMoves_moreThanThreeCrush粉碎
    //大于3）
    for (var row = 0; row < board.boardSize; row++) {
      for (var col = 0; col < board.boardSize; col++) {
        var fromCandy = board.getCandyAt(row, col)
        if (!fromCandy) continue
        for (i = 0; i < 4; i++) {
          var direction = directions[i]
          var numCandiesCrushed = this.numberCandiesCrushedByMove(fromCandy, direction)
          if (numCandiesCrushed == 3) {
            validMovesThreeCrush.push({ candy: fromCandy, direction: direction })
          } else if (numCandiesCrushed > 3) {
            validMovesMoreThanThreeCrush.push({ candy: fromCandy, direction: direction })
          }
        }
      }
    }
    // if there are three-crushes possible, prioritize these
    var searchArray = validMovesThreeCrush.length
      ? validMovesThreeCrush
      : validMovesMoreThanThreeCrush
    // If there are no valid moves, return null.
    if (searchArray.length == 0) return null
    // select a random crush from among the crushes found
    return searchArray[Math.floor(Math.random() * searchArray.length)]
  }
  // 指定具体关卡配置
  this.createSpecifiedBoard = function (boardSpec) {
    color_dict = { r: 'red', o: 'orange', y: 'yellow', g: 'green', b: 'blue', p: 'purple' }

    var numChars = 0

    boardSpec.map(function (i) {
      return (numChars += i.length)
    })
    if (boardSpec.length != board.boardSize || numChars != Math.pow(board.boardSize, 2)) {
      console.warn('boardSpec must be of dimensions boardSize x boardSize to populate board')
      return
    }

    for (var col = 0; col < board.boardSize; col++) {
      for (var row = 0; row < board.boardSize; row++) {
        if (board.getCandyAt(row, col) == null) {
          var color = color_dict[boardSpec[row].charAt(col)]
          board.addCandy(color, row, col)
        }
      }
    }
  }

  // 随机初始化面板
  this.populateBoard = function () {
    for (var col = 0; col < board.boardSize; col++) {
      for (var row = 0; row < board.boardSize; row++) {
        // Check the empty candy position (hole), fill with new candy
        if (board.getCandyAt(row, col) == null) {
          board.addRandomCandy(row, col)
        }
      }
    }
  }
  /*
   *
   *规则的辅助方法. isMoveTypeValid
   *返回如果糖果被压碎的糖果数量
   *由fromCandy提供，将在方向上翻转
   *指定（['上'，'下'，'左'，'右']）
   *
   *如果此移动无效（基于游戏规则），则返回0
   *
   */
  this.numberCandiesCrushedByMove = function (fromCandy, direction) {
    return this.getCandiesToCrushGivenMove(fromCandy, direction).length
  }
  /*
   *
   *规则的辅助方法。numberCandiesCrushedByMove
   *返回将被压碎（即删除）的糖果列表，如果
   *fromCandy将按照方向（['up'，
   *'下'，'左'，'右']）
   *如果移动不会导致粉碎的糖果，则返回一个空列表。
   *
   */
  this.getCandiesToCrushGivenMove = function (fromCandy, direction) {
    var toCandy = board.getCandyInDirection(fromCandy, direction)
    if (!toCandy || toCandy.color == fromCandy.color) {
      return []
    }
    var swap = [fromCandy, toCandy]
    var crushable = this.getCandyCrushes(swap)
    // Only return crushable groups that involve the swapped candies.
    // If the board has incompletely-resolved crushes, there can be
    // many crushable candies that are not touching the swapped ones.
    var connected = crushable.filter(function (set) {
      for (var k = 0; k < swap.length; k++) {
        if (set.indexOf(swap[k]) >= 0) return true
      }
      return false
    })

    return [].concat.apply([], connected) //flatten nested lists
  }
  /*
   *
   *规则的辅助方法. getCandyCrush
   *返回一组长度相同颜色的糖果条
   *板上至少有3个。如果“垂直”设置为true，则仅查找
   *垂直条；否则只有水平条。如果“交换”数组
   *被传递，那么数组中的每个偶数索引糖果都被考虑
   *与数组中的每个奇数索引糖果交换。
   *
   */
  this.findColorStrips = function (vertical, swap) {
    var getAt = function (x, y) {
      // Retrieve the candy at a row and column (depending on vertical)
      var result = vertical ? board.getCandyAt(y, x) : board.getCandyAt(x, y)
      if (swap) {
        // If the result candy is in the 'swap' array, then swap the
        // result with its adjacent pair.
        var index = swap.indexOf(result)
        if (index >= 0) return swap[index ^ 1]
      }
      return result
    }
    var result = []
    for (var j = 0; j < board.boardSize; j++) {
      for (var h, k = 0; k < board.boardSize; k = h) {
        // Scan for rows of same-colored candy starting at k
        var firstCandy = getAt(j, k)
        h = k + 1
        if (!firstCandy) continue
        var candies = [firstCandy]
        for (; h < board.boardSize; h++) {
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
}

//======================= handle.js迁移 操作dom的一系列方法 =======================
var DEBUG = false

// 默认面板大小
var DEFAULT_BOARD_SIZE = 8

// data model at global scope for easier debugging
var board
var rules

var dragDropInfo = null

// load a rule
rules = new Rules(board)

// Functions
function DrawArrow() {
  var validMove = rules.getRandomValidMove()

  var canvas = document.getElementById('canvas')
  var ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, 320, 320)

  var col = validMove.candy.col
  var row = validMove.candy.row

  var candySize = 320 / board.boardSize
  var squareSize = candySize / 2

  var x = (col + 1) * candySize - squareSize
  var y = (row + 1) * candySize - squareSize

  ctx.fillStyle = '#333333'

  ctx.beginPath()
  if (validMove.direction == 'up') {
    ctx.fillRect(x - squareSize / 2, y - squareSize, squareSize, squareSize)

    ctx.moveTo(x - squareSize, y - squareSize + 1)
    ctx.lineTo(x, y - 2 * squareSize)
    ctx.lineTo(x + squareSize, y - squareSize + 1)
  } else if (validMove.direction == 'down') {
    ctx.fillRect(x - squareSize / 2, y, squareSize, squareSize)

    ctx.moveTo(x + squareSize, y + squareSize - 1)
    ctx.lineTo(x, y + squareSize + squareSize)
    ctx.lineTo(x - squareSize, y + squareSize - 1)
  } else if (validMove.direction == 'left') {
    ctx.fillRect(x - squareSize, y - squareSize / 2, squareSize, squareSize)

    ctx.moveTo(x - squareSize + 1, y - squareSize)
    ctx.lineTo(x - 2 * squareSize, y)
    ctx.lineTo(x - squareSize + 1, y + squareSize)
  } else if (validMove.direction == 'right') {
    ctx.fillRect(x, y - squareSize / 2, squareSize, squareSize)

    ctx.moveTo(x + squareSize - 1, y + squareSize)
    ctx.lineTo(x + 2 * squareSize, y)
    ctx.lineTo(x + squareSize - 1, y - squareSize)
  }
  ctx.closePath()
  ctx.fill()
}

function ClearCanvas() {
  var canvas = document.getElementById('canvas')
  var ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, 320, 320)
}

function Crush() {
  /*
	if(rules.getCandyCrushes().length > 0){
		setTimeout(function(){
			rules.moveCandiesDown();
		}, 500);
	}
	*/

  setTimeout(function () {
    rules.moveCandiesDown()
  }, 500)

  rules.removeCrushes(rules.getCandyCrushes())
}

// 开始新游戏
function NewGame() {
  board.clear()
  board.resetScore()
  rules.prepareNewGame()
}

export { Board, Candy, Rules, NewGame }
