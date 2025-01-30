'use strict'
var gBoard

const MINE = '💣'
const LIVES = '🛟'

var gEmptyCells
var gLeftLives

var gStartTime
var gTimerInterval

var gLevel = {
  SIZE: 4,
  MINES: 2,
  LIVES: 3,
}

var gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0 }

function onInit() {
  gBoard = buildBoard()
  renderBoard(gBoard, '.board-container')
  gGame.isOn = false
  gGame.shownCount = 0
  gGame.markedCount = 0
  shownCount()
  markedCount()
  gLeftLives = gLevel.LIVES
}

function buildBoard() {
  const board = []
  for (var i = 0; i < gLevel.SIZE; i++) {
    board[i] = []
    for (var j = 0; j < gLevel.SIZE; j++) {
      board[i][j] = {
        minesAroundCount: 0,
        isShow: false,
        isMine: false,
        isMarked: false,
      }
    }
  }
  // board[0][1].isMine = true
  // board[1][1].isMine = true
  // מקום רנדומלי למוקשים
  // putMinesOnRandEmptyLocations(board)
  // עדכון לולאת שכנים בהתאם למיקום המוקשים
  // updateMinesNegCount(board)
  return board
}

function onCellClicked(elCell, i, j) {
  if (gBoard[i][j].isMarked) return
  if (gBoard[i][j].isShow) return
  if (gLeftLives <= 0) return
  // gBoard[0][1].isMine = true
  // gBoard[1][1].isMine = true

  // מה שקורה בהתחלה
  if (!gGame.isOn) {
    startStopwatch()
    putMinesOnRandEmptyLocations(gBoard)
    updateMinesNegCount(gBoard)
    // if (gBoard[i][j].minesAroundCount === 0) {
    //   console.log(elCell)
    // }
    // אם בלחיצה הראשונה פגשתי במוקש, תזוז
    if (gBoard[i][j].isMine) {
      gBoard[i][j].isMine = false
      // console.log(`it was a bomb! at first click ${i},${j}`)
      // שינוי מיקום של הפצצה
      var newMineIdx = getRandomIntInclusive(0, gEmptyCells.length - 1)
      var newMineLocation = gEmptyCells[newMineIdx]
      // console.log(`the bomb move to ${newMineLocation.i},${newMineLocation.j}`)
      gBoard[newMineLocation.i][newMineLocation.j].isMine = true
      renderCell(newMineLocation, gBoard[i][j].minesAroundCount)
      updateMinesNegCount(gBoard)
    }
    if (gBoard[i][j].minesAroundCount === 0) {
      // console.log(`Cell (${i},${j}) is 0, expanding...`)
      expandUncover(gBoard, elCell, i, j)
    }

    renderCell({ i, j }, gBoard[i][j].minesAroundCount)
    updateMinesNegCount(gBoard)
    gGame.isOn = true
  }

  if (gGame.isOn & !gBoard[i][j].isMine) {
    // elCell.innerHTML = gBoard[i][j].minesAroundCount
    // elCell.style.color = 'black'
    elCell.classList.add('clicked')
    gBoard[i][j].isShow = true

    renderCell({ i, j }, gBoard[i][j].minesAroundCount)
  }

  if (gGame.isOn & gBoard[i][j].isMine) {
    console.log('press on mine!')
    elCell.classList.add('clicked')
    elCell.classList.add('mine')
    gBoard[i][j].isShow = true
    renderCell({ i, j }, MINE)
    var elSmiley = document.querySelector('.smiley')
    elSmiley.innerHTML = '🤯'
    lives(-1)
    if (gLeftLives === 0) {
      gBoard[i][j].isShow = false
      return
    }
    setTimeout(() => {
      var elSmiley = document.querySelector('.smiley')
      elSmiley.innerHTML = '😀'
      elCell.classList.remove('clicked')
      elCell.classList.remove('mine')
      gBoard[i][j].isShow = false
      renderCell({ i, j }, '')
    }, 1000)

    // gameOver()
  }

  shownCount()
  //check if victory after the press
  isVictory()
}

function expandUncover(board, elCell, i, j) {
  var neighs = []
  var pos = { i, j }
  for (var i = pos.i - 1; i <= pos.i + 1; i++) {
    if (i < 0 || i > board.length - 1) continue
    for (var j = pos.j - 1; j <= pos.j + 1; j++) {
      if (j < 0 || j > board[0].length - 1) continue
      if ((pos.i === i) & (pos.j === j)) continue
      neighs.push({ i, j })
    }
  }
  // console.log('neighs:', neighs)
  for (var i = 0; i < neighs.length; i++) {
    var currNeigh = neighs[i]
    board[currNeigh.i][currNeigh.j].isShow = true
    var className = '.' + getClassName(currNeigh)
    // console.log('className:', className)
    var elCell = document.querySelector(className)
    // console.log('elCell:', elCell)
    renderCell(currNeigh, board[currNeigh.i][currNeigh.j].minesAroundCount)
    elCell.classList.add('clicked')
  }
}

/// === אלגוריתם רנדומלי למציאת מקום לריק למוקש ====

function findEmptyCell(board) {
  gEmptyCells = []
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      var currCell = board[i][j]
      if (!currCell.isMine) {
        gEmptyCells.push({ i, j })
      }
    }
  }
  var randIdx = getRandomIntInclusive(0, gEmptyCells.length - 1)
  var emptyCellLocation = gEmptyCells[randIdx]

  return emptyCellLocation
}

function putMinesOnRandEmptyLocations(board) {
  for (var i = 0; i < gLevel.MINES; i++) {
    var location = findEmptyCell(board)
    board[location.i][location.j].isMine = true
    gEmptyCells.splice(gEmptyCells.indexOf(location), 1)
  }
  // console.log('emptyCells:', gEmptyCells)
}
// ==================================================== //

//לולאת שכנים לספירת מס המוקשים השכנים
function setMinesNegsCount(pos, board) {
  var neighs = 0
  for (var i = pos.i - 1; i <= pos.i + 1; i++) {
    if (i < 0 || i > board.length - 1) continue
    for (var j = pos.j - 1; j <= pos.j + 1; j++) {
      if (j < 0 || j > board[0].length - 1) continue
      var currCell = board[i][j]
      if ((pos.i === i) & (pos.j === j)) continue
      // console.log(currCell)
      if (currCell.isMine) {
        neighs++
      }

      // console.log(`i:${i},j:${j},${currCell}`)
    }
  }
  // console.log('==============================')
  return neighs
}

// מעדכנת את מספר המוקשים
function updateMinesNegCount(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      var currCell = board[i][j]
      currCell.minesAroundCount = setMinesNegsCount({ i, j }, board)
    }
  }
}

function lives(num) {
  console.log('gLeftLives:', gLeftLives)
  gLeftLives += num

  var elLives = document.querySelector('.lives span')
  switch (gLeftLives) {
    case 3:
      elLives.innerHTML = '🛟🛟🛟'
      break
    case 2:
      elLives.innerHTML = '🛟🛟'
      break
    case 1:
      elLives.innerHTML = '🛟'
      break
    case 0:
      elLives.innerHTML = '☠️'
      markAllmines()
      break
    default:
      break
  }
}

function onRestart() {
  gLevel.LIVES = 3
  var elLives = document.querySelector('.lives span')
  elLives.innerHTML = '🛟🛟🛟'
  var elSmiley = document.querySelector('.smiley')
  elSmiley.innerHTML = '😀'
  resetStopwatch()
  onInit()
}

function markAllmines() {
  // אם לחצנו על מוקש, כל המוקשים נגלים
  var minesLocation = []
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[i].length; j++) {
      var currCell = gBoard[i][j]
      if (currCell.isMine) {
        minesLocation.push({ i, j })
      }
    }
  }
  for (var i = 0; i < minesLocation.length; i++) {
    var currMine = minesLocation[i]
    gBoard[currMine.i][currMine.j].isMine = true
    renderCell(currMine, MINE)
    var elClassName = '.' + getClassName(currMine)
    var elCell = document.querySelector(elClassName)
    elCell.classList.add('clicked')
  }
  var elSmiley = document.querySelector('.smiley')
  elSmiley.innerHTML = '🤯'
  stopStopwatch()
}

function onCellMarked(ev) {
  if (isVictory()) return
  console.log('hi:')
  if (ev.button === 2) {
    ev.preventDefault() // מניעת תפריט ההקשר של הדפדפן

    var classNameCell = '.' + ev.srcElement.classList[1]
    var elCell = document.querySelector(classNameCell)

    // console.log(classNameCell.indexOf('-') + 1)
    // console.log(classNameCell.indexOf('-', classNameCell.indexOf('-') + 1) + 1)

    // find the indexes of {i,j} of the cell
    var cellIdx = {
      i: +classNameCell[classNameCell.indexOf('-') + 1],
      j: +classNameCell[classNameCell.indexOf('-', classNameCell.indexOf('-') + 1) + 1],
    }
    // you cant mark a cell if it show!
    if (gBoard[cellIdx.i][cellIdx.j].isShow) return

    if (!gBoard[cellIdx.i][cellIdx.j].isMarked) {
      //Model Update:
      gBoard[cellIdx.i][cellIdx.j].isMarked = true

      //Dom Update:
      elCell.innerHTML = '🚩'
      if (isVictory()) {
      }
    } else if (gBoard[cellIdx.i][cellIdx.j].isMarked) {
      //Model Update:
      gBoard[cellIdx.i][cellIdx.j].isMarked = false
      //Dom Update:
      elCell.innerHTML = ''
    }

    // console.log('cellIdx.i:', cellIdx.i)
    // console.log('cellIdx.j:', cellIdx.j)
    markedCount()
  }
}

function onDiffchose(elBtn) {
  console.log('elBtn.innerHTML:', elBtn.innerHTML)
  if (elBtn.innerHTML === 'Beginner') {
    gLevel.SIZE = 4
    gLevel.MINES = 2
  } else if (elBtn.innerHTML === 'Medium') {
    gLevel.SIZE = 8
    gLevel.MINES = 14
  } else if (elBtn.innerHTML === 'Expert') {
    gLevel.SIZE = 12
    gLevel.MINES = 32
  }

  onRestart()
}

function isVictory() {
  var ifEmpty = []
  for (var i = 0; i < gBoard.length; i++) {
    for (let j = 0; j < gBoard[i].length; j++) {
      var currCell = gBoard[i][j]
      if (
        (currCell.isMine === true && currCell.isMarked === false) ||
        (currCell.isMine === false && currCell.isShow === false)
      ) {
        // console.log(`push the idx:${i},${j}`)
        ifEmpty.push(currCell)
      }
    }
  }
  // console.log('ifEmpty:', ifEmpty)
  if (ifEmpty.length === 0) {
    console.log('win')
    gGame.isOn = false
    var elSmiley = document.querySelector('.smiley')
    elSmiley.innerHTML = '😎'
    stopStopwatch()
    return true
  }
  return false
}

function shownCount() {
  gGame.shownCount = 0
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[i].length; j++) {
      var currCell = gBoard[i][j]
      if (currCell.isShow & !currCell.isMine) {
        gGame.shownCount++
      }
    }
  }
  var elCell = document.querySelector('.numsgame .showcount')
  elCell.innerHTML = gGame.shownCount
}

function markedCount() {
  gGame.markedCount = 0
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[i].length; j++) {
      var currCell = gBoard[i][j]
      if (currCell.isMarked) {
        gGame.markedCount++
      }
    }
  }
  var elCell = document.querySelector('.numsgame .markedcount')
  elCell.innerHTML = gGame.markedCount
}
