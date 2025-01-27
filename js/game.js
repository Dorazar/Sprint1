'use strict'
var gBoard

const MINE = '💣'

var gLevel = {
  SIZE: 4,
  MINES: 2,
}

var gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0 }

function onInit() {
  gBoard = buildBoard()
  console.table(gBoard)

  renderBoard(gBoard, '.board-container')
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
  board[0][1].isMine = true
  board[1][1].isMine = true

  updateMinesNegCount(board)

  return board
}

function renderBoard(mat, selector) {
  var strHTML = '<table><tbody>'
  for (var i = 0; i < mat.length; i++) {
    strHTML += '<tr>'
    for (var j = 0; j < mat[0].length; j++) {
      var currCell = mat[i][j]
      var cell = currCell.isMine ? (cell = MINE) : (cell = currCell.minesAroundCount)
      const className = `cell cell-${i}-${j}`

      strHTML += `<td class="${className}" onclick=onCellClicked(this,${i},${j})> ${cell}</td>`
    }

    strHTML += '</tr>'
  }
  strHTML += '</tbody></table>'

  const elContainer = document.querySelector(selector)
  elContainer.innerHTML = strHTML
}

// לולאת שכנים
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

function onCellClicked(elCell, i, j) {
  if (gBoard[i][j] === MINE) return

  elCell.style.color = 'black'
  console.log(`i:${i},j:${j}`)
  console.log(elCell)
}
