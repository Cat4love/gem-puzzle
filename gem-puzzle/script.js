// create elements
const container = document.createElement('div');
container.className = 'container';
document.body.append(container);

const game = document.createElement('div');
game.className = 'game';
container.append(game);

const popup = document.createElement('div');
popup.className = 'game__popup';
game.append(popup);

const popupWraper = document.createElement('div');
popupWraper.className = 'game__popup-wraper';
popup.append(popupWraper);

const closePopup = document.createElement('p');
closePopup.innerHTML = '-Close-';
closePopup.className = 'game__close';
popup.append(closePopup);

const title = document.createElement('h1');
title.innerHTML = 'Sliding Tile Puzzle';
title.className = 'game__title';
game.append(title);

const buttons = document.createElement('div');
buttons.className = 'game__buttons';
game.append(buttons);

const start = document.createElement('button');
start.className = 'game__button';
start.innerHTML = '-Shuffle-';
buttons.append(start);

const save = document.createElement('button');
save.className = 'game__button';
save.innerHTML = '-Save-';
buttons.append(save);

const load = document.createElement('button');
load.className = 'game__button';
load.innerHTML = '-Load-';
buttons.append(load);

const results = document.createElement('button');
results.className = 'game__button';
results.innerHTML = '-Results-';
buttons.append(results);

const sound = document.createElement('button');
sound.className = 'game__button';
sound.innerHTML = '-Sound-';
buttons.append(sound);
let soundFlag = true;

const info = document.createElement('div');
info.className = 'game__info';
game.append(info);

let counter = document.createElement('p');
counter.className = 'game__counter';
let count = 0;
counter.innerHTML = `Moves: ${count}`;
info.append(counter);

const timer = document.createElement('p');
timer.className = 'game__timer';
timer.innerHTML = 'Time: 00:00';
info.append(timer);

const wraper = document.createElement('div');
wraper.className = 'game__wraper';
game.append(wraper);

const size = document.createElement('div');
size.className = 'game__size';
game.append(size);

const label = document.createElement('label');
label.className = 'game__label';
label.innerText = 'Frame size:';
size.append(label);

const select = document.createElement('select');
select.className = 'game__select';
size.append(select);

for (let i = 0; i < 6; i++) {
  let fieldSize = [
    ['3x3', 3],
    ['4x4', 4],
    ['5x5', 5],
    ['6x6', 6],
    ['7x7', 7],
    ['8x8', 8],
  ];
  const option = document.createElement('option');
  option.className = 'game__option';
  option.innerHTML = fieldSize[i][0];
  option.value = fieldSize[i][1];
  if (i === 1) {
    option.selected = true;
  }
  select.append(option);
}
// add global variables
let time = 0;
let timerInterval;
let showTimer;
let resultsArray = [];
let resultsArrayLength = 0;
let gameSize = 310;
let amount = 4;
let cells = [];

// add event listeners
start.addEventListener('click', () => {
  wraper.firstChild.remove();
  generateNewGame(amount);
  count = 0;
  counter.innerHTML = `Moves: ${count}`;
});

select.addEventListener('change', () => {
  amount = select.value;
  wraper.firstChild.remove();
  generateNewGame(amount, null);
  count = 0;
  counter.innerHTML = `Moves: ${count}`;
});

save.addEventListener('click', () => {
  saveGame();
});

load.addEventListener('click', () => {
  loadGame();
});

sound.addEventListener('click', () => {
  if (soundFlag) {
    soundFlag = false;
  } else {
    soundFlag = true;
  }
  sound.classList.toggle('sound__off');
});

results.addEventListener('click', () => {
  popup.classList.add('show__popup');
  resultsArray.sort((a, b) => b.score - a.score);
  for (let i = 0; i < resultsArray.length && i < 10; i++) {
    popupWraper.innerText += `\n${i + 1}. size: ${
      resultsArray[i].size
    },  time: ${resultsArray[i].time},  moves: ${
      resultsArray[i].moves
    },  score:  ${resultsArray[i].score}\n`;
  }
});

closePopup.addEventListener('click', () => {
  popup.classList.remove('show__popup');
  popupWraper.innerText = '';
});

container.addEventListener('click', (event) => {
  if(event.target.className === 'container' &&  popup.classList.contains('show__popup')){
    popup.classList.remove('show__popup');
    popupWraper.innerText = '';
  }
});

window.addEventListener('load', () => {
  resultsArrayLength = Number(localStorage.getItem('resultsArrayLength'));
  for (let i = 0; i < resultsArrayLength; i++) {
    resultsArray.push(JSON.parse(localStorage.getItem(`score: ${i}`)));

    resultsArray.sort((a, b) => b.score - a.score);
  }
});

// add functions
function startTimer() {
  stopTimer();
  timerInterval = setInterval(function () {
    time += 1 / 60;
    secondVal = Math.floor(time) - Math.floor(time / 60) * 60;
    minuteVal = Math.floor(time / 60);
    timer.innerHTML = `Time: ${
      minuteVal < 10 ? '0' + minuteVal.toString() : minuteVal
    }:${secondVal < 10 ? '0' + secondVal.toString() : secondVal}`;
    showTimer = timer.innerHTML;
  }, 1000 / 60);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function generateNewGame(amount, saveCells = null, saveTime = 0) {
  time = saveTime;

  stopTimer();

  if (saveTime === 0) {
    timer.innerHTML = 'Time: 00:00';
  } else {
    secondVal = Math.floor(time) - Math.floor(time / 60) * 60;
    minuteVal = Math.floor(time / 60);
    timer.innerHTML = `Time: ${
      minuteVal < 10 ? '0' + minuteVal.toString() : minuteVal
    }:${secondVal < 10 ? '0' + secondVal.toString() : secondVal}`;
    showTimer = timer.innerHTML;
  }
  const field = document.createElement('div');
  field.className = 'game__field';
  wraper.append(field);

  function generateDigits() {
    return Array.from(new Array(amount ** 2 - 1).keys()).sort(
      () => Math.random() - 0.5
    );
  }

  function testNumbers(numbers) {
    let testArray = numbers;
    let count = 0;
    for (let i = amount ** 2 - 1; i >= 1; i--) {
      testArray = testArray.slice(0, i);
      for (let j = amount ** 2 - 1; j >= 1; j--) {
        if (testArray[i - 1] + 1 < testArray[j - 1] + 1) {
          count += 1;
        }
      }
    }
    if (amount % 2 !== 0 && count % 2 === 0) {
      return true;
    } else if (amount % 2 === 0 && count % 2 !== 0) {
      return true;
    } else {
      return false;
    }
  }

  function getNumbers() {
    let numbers;
    numbers = generateDigits();
    if (testNumbers(numbers)) {
      trueNumbers = numbers;
    } else {
      getNumbers();
    }
    return trueNumbers;
  }

  const numbers = getNumbers();

  cells = [];

  let empty = {};

  if (saveCells == null) {
    (empty.top = 0), (empty.left = 0), (empty.value = 0);
  } else {
    (empty.top = saveCells[0].top),
      (empty.left = saveCells[0].left),
      (empty.value = 0);
  }

  cells.push(empty);

  for (let i = 1; i <= amount ** 2 - 1; i++) {
    const cell = document.createElement('div');
    cell.className = 'game__cell';
    cell.style.width = `${gameSize / amount}px`;
    cell.style.height = `${gameSize / amount}px`;
    let left = 0;
    let top = 0;
    let value = 0;
    if (saveCells == null) {
      left = i % amount;
      top = (i - left) / amount;
      cell.innerHTML = numbers[i - 1] + 1;
      value = numbers[i - 1] + 1;
      cell.style.left = `${left * (gameSize / amount)}px`;
      cell.style.top = `${top * (gameSize / amount)}px`;
    } else {
      left = saveCells[i].left;
      top = saveCells[i].top;
      cell.innerHTML = saveCells[i].value;
      value = saveCells[i].value;
      cell.style.left = `${left * (gameSize / amount)}px`;
      cell.style.top = `${top * (gameSize / amount)}px`;
    }

    cells.push({
      value: value,
      left: left,
      top: top,
      element: cell,
    });
    field.append(cell);

    cell.addEventListener('click', () => {
      move(i);
    });

    cell.addEventListener('dragstart', dragStart);

    field.addEventListener('drop', drop);
  }

  function activeCells() {
    for (let i = 1; i < cells.length; i++) {
      cells[i].element.draggable = false;
      cells[i].element.classList.remove('game__cell-active');
      if (
        Math.abs(empty.left - cells[i].left) +
          Math.abs(empty.top - cells[i].top) ===
        1
      ) {
        cells[i].element.draggable = true;
        cells[i].element.classList.add('game__cell-active');
      }
    }
  }

  function dragStart(event) {
    for (let i = 0; i < cells.length; i++) {
      if (cells[i].value === Number(event.target.innerText)) {
        event.dataTransfer.setData('cell', i);
      }
    }
  }

  function drop(event) {
    let i = event.dataTransfer.getData('cell');
    let cell = cells[i];
    if (soundFlag) {
      getSound();
    }

    if (Math.abs(empty.left - cell.left) + Math.abs(empty.top - cell.top) > 1) {
      return;
    } else {
      cell.element.style.left = `${empty.left * (gameSize / amount)}px`;
      cell.element.style.top = `${empty.top * (gameSize / amount)}px`;
      const emptyleft = empty.left;
      const emptyTop = empty.top;
      empty.left = cell.left;
      empty.top = cell.top;
      cell.left = emptyleft;
      cell.top = emptyTop;
    }
    startTimer();
    activeCells();
    count += 1;
    counter.innerHTML = `Moves: ${count}`;
    test();
  }

  field.addEventListener('dragover', (event) => {
    if (event.target.className === 'game__field') {
      event.preventDefault();
    }
  });

  function move(index) {
    startTimer();
    if (soundFlag) {
      getSound();
    }
    let cell = cells[index];
    if (Math.abs(empty.left - cell.left) + Math.abs(empty.top - cell.top) > 1) {
      return;
    } else {
      cell.element.style.left = `${empty.left * (gameSize / amount)}px`;
      cell.element.style.top = `${empty.top * (gameSize / amount)}px`;
      const emptyleft = empty.left;
      const emptyTop = empty.top;
      empty.left = cell.left;
      empty.top = cell.top;
      cell.left = emptyleft;
      cell.top = emptyTop;
    }
    activeCells();
    count += 1;
    counter.innerHTML = `Moves: ${count}`;
    test();
  }

  function test() {
    let flag = true;
    for (let i = 1; i <= amount ** 2 - 1; i++) {
      if (cells[i].value !== cells[i].top * amount + cells[i].left + 1) {
        flag = false;
      }
    }
    if (flag) {
      popupWraper.innerText = `Hooray! You solved the puzzle in ${showTimer.slice(
        6
      )} and ${count} moves!`;
      popup.classList.add('show__popup');
      let result = {};
      resultsArray.push({
        size: amount,
        moves: count,
        time: showTimer.slice(6),
        score: Math.ceil((Number(amount) / count) * 100000),
      });
      resultsArray.sort((a, b) => b.score - a.score);
      if (resultsArray.length >= 10) {
        resultsArray = resultsArray.slice(0, 10);
      }
      resultsArrayLength = resultsArray.length;
      localStorage.setItem('resultsArrayLength', resultsArrayLength);
      for (let i = 0; i < resultsArray.length; i++) {
        localStorage.removeItem(
          (`score: ${i}`, JSON.stringify(resultsArray[i]))
        );
      }
      for (let i = 0; i < resultsArray.length; i++) {
        localStorage.setItem(`score: ${i}`, JSON.stringify(resultsArray[i]));
      }
      wraper.firstChild.remove();
      generateNewGame(amount, null);
      count = 0;
      counter.innerHTML = `Moves: ${count}`;
    } else {
      return;
    }
  }
  activeCells();
}

function saveGame() {
  localStorage.clear();
  localStorage.setItem('flag', null);
  for (let i = 0; i < cells.length; i++) {
    localStorage.setItem(`cell: ${i}`, JSON.stringify(cells[i]));
  }
  localStorage.setItem('amount', amount);
  localStorage.setItem('count', count);
  localStorage.setItem('timer', time);
}

function loadGame() {
  amount = Number(localStorage.getItem('amount'));
  let saveCells = [];
  for (let i = 0; i < amount ** 2; i++) {
    saveCells.push(JSON.parse(localStorage.getItem(`cell: ${i}`)));
  }
  saveTimer = Number(localStorage.getItem('timer'));
  count = Number(localStorage.getItem('count'));
  counter.innerHTML = `Moves: ${count}`;
  for (let i = 0; i < 6; i++) {
    if (amount == select.childNodes[i].value) {
      select.childNodes[i].selected = true;
    }
  }
  if (wraper.childNodes.length !== 0) {
    wraper.firstChild.remove();
  }
  generateNewGame(amount, saveCells, saveTimer);
}

function getSound() {
  let audio = new Audio();
  audio.src = '../../assets/audio/stone_touch_effect.mp3';
  audio.autoplay = true;
}

// start first game
generateNewGame(amount);
