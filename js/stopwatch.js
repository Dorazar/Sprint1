'use strict'

var gBeginner = []
var gMedium = []
var gExpert = []

function startStopwatch() {
  gStartTime = Date.now()
  gTimerInterval = setInterval(updateStopwatch, 10)
}

function stopStopwatch() {
  var elWinTime = document.querySelector('.timer').innerHTML
  document.querySelector('.timer').innerHTML = elWinTime

  console.log('elWinTime:', elWinTime)
  clearInterval(gTimerInterval)
  if (gLeftLives === 0) return // if game over it will not count
  // score(elWinTime, gLevel.SIZE)
  saveTime(elWinTime, gLevel.SIZE)
}

function resetStopwatch() {
  clearInterval(gTimerInterval)
  document.querySelector('.timer').textContent = '00'
}

function updateStopwatch() {
  const elapsedTime = Date.now() - gStartTime
  const minutes = Math.floor(elapsedTime / 60000)
    .toString()
    .padStart(2, '0')
  const seconds = Math.floor((elapsedTime % 60000) / 1000)
    .toString()
    .padStart(2, '0')
  const milliseconds = Math.floor((elapsedTime % 1000) / 10)
    .toString()
    .padStart(2, '0')
  document.querySelector('.timer').textContent = `${seconds}`
}

function saveTime(time, size) {
  var size = gLevel.SIZE
  var difficult
  var min
  switch (size) {
    case 4:
      difficult = 'Beginner'
      if (!gBeginner.includes(+time)) {
        gBeginner.push(+time)
      }
      min = Math.min(...gBeginner)
      localStorage.difficult = min
      document.querySelector('.scores .beginner').innerHTML = localStorage.difficult
      break
    case 8:
      difficult = 'Medium'
      gMedium.push(+time)
      if (!gMedium.includes(+time)) {
        gMedium.push(+time)
        document.querySelector('.scores .medium').innerHTML = localStorage.difficult
      }
      min = Math.min(...gMedium)
      localStorage.difficult = min
      break
    case 12:
      difficult = 'Expert'
      gExpert.push(+time)
      if (!gExpert.includes(+time)) {
        gExpert.push(+time)
      }
      min = Math.min(...gExpert)
      localStorage.difficult = min
      document.querySelector('.scores .expert').innerHTML = localStorage.difficult
      break
    default:
      break
  }

  console.log('gBeginner:', gBeginner, `min:`, min)
  console.log('gMedium:', gMedium)
  console.log('gExpert:', gExpert)
}
