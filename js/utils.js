'use strict'
function getRandomIntInclusive(min, max) {
  const minCeiled = Math.ceil(min)
  const maxFloored = Math.floor(max)
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled) // The maximum is inclusive and the minimum is inclusive
}

function renderBoard(mat, selector) {
  var strHTML = '<table><tbody>'
  for (var i = 0; i < mat.length; i++) {
    strHTML += '<tr>'
    for (var j = 0; j < mat[0].length; j++) {
      var currCell = mat[i][j]
      var cell = currCell.isMine ? (cell = MINE) : (cell = currCell.minesAroundCount)
      const className = `cell cell-${i}-${j}`

      strHTML += `<td class="${className}" onclick=onCellClicked(this,${i},${j});onCellClickedMarkFlag(event)
      >${cell}</td>`
    }

    strHTML += '</tr>'
  }
  strHTML += '</tbody></table>'

  const elContainer = document.querySelector(selector)
  elContainer.innerHTML = strHTML
}
