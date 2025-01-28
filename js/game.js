'use strict'
var gBoard

const MINE = '💣'
const LIVES = '🛟'

var gLevel = {
  SIZE: 4,
  MINES: 2,
  LIVES: 3,
}

var gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0 }

function onInit() {
  gBoard = buildBoard()
  renderBoard(gBoard, '.board-container')
  lives(gLevel.LIVES)
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
  if (gBoard[i][j].isShow) return

  if (!gLevel.LIVES) {
    console.log('game over')
    //add game over function
    gGame.isOn = false
    gameOver()
    return
  }

  if (!gBoard[i][j].isMine) {
    gGame.isOn = true
    // elCell.innerHTML = gBoard[i][j].minesAroundCount
    // elCell.style.color = 'black'
    elCell.classList.add('clicked')
    gBoard[i][j].isShow = true

    gBoard[0][1].isMine = true
    gBoard[1][1].isMine = true
    gBoard[3][0].isMine = true
    updateMinesNegCount(gBoard)
    console.log(`i:${i},j:${j}`)
    console.log(elCell)
    console.log(gBoard[i][j])
    renderCell({ i, j }, gBoard[i][j].minesAroundCount)
  } else if (gBoard[i][j].isMine) {
    console.log('press on mine!')
    elCell.classList.add('clicked')
    renderCell({ i, j }, MINE)
    gLevel.LIVES--
    lives()
    if (!gLevel.LIVES) {
      console.log('game over')
      //add game over function
      gGame.isOn = false
      gameOver()
      return
    }
  }
}

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

/// === אלגוריתם רנדומלי למציאת מקום לריק למוקש ====

// לשקול להוריד את הבדיקה אם התא ריק
// function findEmptyCell(board) {
//   var emptyCells = []
//   for (var i = 0; i < board.length; i++) {
//     for (var j = 0; j < board[i].length; j++) {
//       var currCell = board[i][j]
//       if (currCell.isMine === false) {
//         emptyCells.push({ i, j })
//       }
//     }
//   }
//   var randIdx = getRandomIntInclusive(0, emptyCells.length - 1)
//   var emptyCellLocation = emptyCells[randIdx]
//   return emptyCellLocation
// }

// function putMinesOnRandEmptyLocations(board) {
//   for (var i = 0; i < gLevel.MINES; i++) {
//     var location = findEmptyCell(board)
//     board[location.i][location.j].isMine = true
//   }
// }
// ==================================================== //

function renderCell(location, value) {
  const cellSelector = '.' + getClassName(location)
  const elCell = document.querySelector(cellSelector)
  elCell.innerHTML = value
}
function getClassName(location) {
  const cellClass = 'cell-' + location.i + '-' + location.j
  return cellClass
}

function lives() {
  var leftLives = gLevel.LIVES
  console.log(leftLives)
  var elLives = document.querySelector('.lives span')
  switch (leftLives) {
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
      break
    default:
      break
  }
}

function onRestart() {
  gLevel.LIVES = 3
  onInit()
}

function gameOver() {
  var elSmiley = document.querySelector('.smiley')
  elSmiley.innerHTML = '🤯'
}

function isVictory() {}

function onCellClickedMarkFlag(ev) {
  console.log(ev)
}
