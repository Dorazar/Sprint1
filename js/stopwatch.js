'use strict'

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
  score(elWinTime, gLevel.SIZE)
}

function resetStopwatch() {
  clearInterval(gTimerInterval)
  document.querySelector('.timer').textContent = '00:00:00'
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
  document.querySelector('.timer').textContent = `${minutes}:${seconds}:${milliseconds}`
}

// לא שומר את השיא האחרון נכון, פשוט דורס את הקיים..

function score(time, size) {
  var size = gLevel.SIZE
  localStorage.stopper = time

  switch (size) {
    case 4:
      document.querySelector('.scores .beginner').innerHTML = localStorage.stopper
      break
    case 8:
      document.querySelector('.scores .medium').innerHTML = localStorage.stopper
      break
    case 12:
      document.querySelector('.scores .expert').innerHTML = localStorage.stopper
      break
    default:
      break
  }
}
