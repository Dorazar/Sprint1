function startStopwatch() {
  gStartTime = Date.now()
  gTimerInterval = setInterval(updateStopwatch, 10)
}

function stopStopwatch() {
  var elWinTime = document.querySelector('.numsgame .timer').innerHTML
  document.querySelector('.numsgame .timer').innerHTML = elWinTime
  console.log('elWinTime:', elWinTime)
  clearInterval(gTimerInterval)
}

function resetStopwatch() {
  clearInterval(gTimerInterval)
  document.querySelector('.numsgame .timer').textContent = '00:00:00'
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
  document.querySelector('.numsgame .timer').textContent = `${minutes}:${seconds}:${milliseconds}`
}
