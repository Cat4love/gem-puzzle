const game = document.createElement('div');
game.className = 'game';
document.body.append(game);

const header = document.createElement('div');
header.className = 'game__header';
game.append(header);

const buttons = document.createElement('div');
buttons.className = 'game__butons';
header.append(buttons);

const start = document.createElement('button');
start.className = 'game__buton';
start.innerHTML = 'Shuffle and start';
buttons.append(start);

const save = document.createElement('button');
save.className = 'game__buton';
save.innerHTML = 'Save';
buttons.append(save);

const load = document.createElement('button');
load.className = 'game__buton';
load.innerHTML = 'Load';
buttons.append(load);

const results = document.createElement('button');
results.className = 'game__buton';
results.innerHTML = 'Results';
buttons.append(results);

const sound = document.createElement('button');
sound.className = 'game__buton';
sound.innerHTML = 'Sound';
buttons.append(sound);
let soundFlag = true;

const info = document.createElement('div');
info.className = 'game__info';
header.append(info);

let counter = document.createElement('p');
counter.className = 'game__counter';
let count = 0;
counter.innerHTML = `Moves: ${count}`;
info.append(counter);

const timer = document.createElement('span');
timer.className = 'game__timer';
info.append(timer);

let time = 0;
let timerInterval;
function startTimer() {
  stopTimer();
  timerInterval = setInterval(function () {
    time += 1 / 60;
    secondVal = Math.floor(time) - Math.floor(time / 60) * 60;
    minuteVal = Math.floor(time / 60);
    timer.innerHTML = `Time: ${
      minuteVal < 10 ? '0' + minuteVal.toString() : minuteVal
    }:${secondVal < 10 ? '0' + secondVal.toString() : secondVal}`;
  }, 1000 / 60);
}

function stopTimer() {
  clearInterval(timerInterval);
}


const wraper = document.createElement('div');
wraper.className = 'game__wraper';
game.append(wraper);

let amount = 4;

start.addEventListener('click', () => {
  wraper.firstChild.remove();
  newGame(amount);
  count = 0;
  counter.innerHTML = `Moves: ${count}`;
});

let cells = [];

function newGame(amount, saveCells = null, timer = 0) {
  time = timer;
  startTimer();
  const field = document.createElement('div');
  field.className = 'game__field';
  wraper.append(field);

  const numbers = Array.from(new Array(amount ** 2 - 1).keys()).sort(
    () => Math.random() - 0.5
  );
  cells = [];
  
  let empty = {};

  if (saveCells == null){
    empty.top = 0,
    empty.left = 0,
    empty.value = 0
  } else {
    empty.top = saveCells[0].top,
    empty.left = saveCells[0].left,
    empty.value = saveCells[0].value
  }

  cells.push(empty);

  for (let i = 1; i <= amount ** 2 - 1; i++) {
    const cell = document.createElement('div');
    cell.className = 'game__cell';
    cell.style.width = `${320 / amount}px`;
    cell.style.height = `${320 / amount}px`;
    let left = 0;
    let top = 0;
    let value = 0;
    if (saveCells == null){
      left = i % amount;
      top = (i - left) / amount;
      cell.innerHTML = numbers[i - 1] + 1;
      value = numbers[i - 1] + 1;
      cell.style.left = `${left * (320 / amount)}px`;
      cell.style.top = `${top * (320 / amount)}px`;
    } else {
      left = saveCells[i].left
      top = saveCells[i].top
      cell.innerHTML = saveCells[i].value
      value = saveCells[i].value
      cell.style.left = `${left * (320 / amount)}px`;
      cell.style.top = `${top * (320 / amount)}px`;
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
  }

  function move(index) {
    if(soundFlag){
      getSound();
    }
    
    startTimer();
    const cell = cells[index];

    if (Math.abs(empty.left - cell.left) + Math.abs(empty.top - cell.top) > 1) {
      return;
    } else {
      cell.element.style.left = `${empty.left * (320 / amount)}px`;
      cell.element.style.top = `${empty.top * (320 / amount)}px`;

      const emptyleft = empty.left;
      const emptyTop = empty.top;

      empty.left = cell.left;
      empty.top = cell.top;

      cell.left = emptyleft;
      cell.top = emptyTop;
    }

    count += 1;
    counter.innerHTML = `Moves: ${count}`;

    function test() {
      let flag = true;
      for (let i = 1; i <= (amount ** 2) - 1; i++) {
        if (cells[i].value !== cells[i].top * amount + cells[i].left + 1) {
          flag = false;
        }
      }
      return flag;
    }

    if (test()) {
      console.log('you win');
    }
  }
}

const footer = document.createElement('div');
footer.className = 'game__footer';
game.append(footer);

const label = document.createElement('label');
label.className = 'game__label';
label.innerText = 'Frame size:';
footer.append(label);

const select = document.createElement('select');
select.className = 'game__select';
footer.append(select);

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

newGame(amount);

select.addEventListener('change', () => {
  amount = select.value;
  wraper.firstChild.remove();
  newGame(amount, null);
  count = 0;
  counter.innerHTML = `Moves: ${count}`;
});

function saveGame(){
  localStorage.clear()
  localStorage.setItem('flag', null)
  for (let i = 0; i < cells.length; i++){
    localStorage.setItem(i, JSON.stringify(cells[i]))
  }
  localStorage.setItem('amount', amount)
  localStorage.setItem('count', count)
  localStorage.setItem('timer', time)
}

function loadGame(){
  amount = Number(localStorage.getItem('amount'))
  let saveCells = []
    for (let i = 0; i < amount ** 2; i++){
      saveCells.push(JSON.parse(localStorage.getItem(i)))
  }
  saveTimer = Number(localStorage.getItem('timer'))
  count = Number(localStorage.getItem('count'));
  counter.innerHTML = `Moves: ${count}`;
  for (let i = 0; i < 6; i++) {
    if(amount == select.childNodes[i].value){
      select.childNodes[i].selected = true;
    }
  }
  if (wraper.childNodes.length !== 0){
    wraper.firstChild.remove();
  }
  newGame(amount, saveCells, saveTimer)
}

save.addEventListener('click', ()=>{
  saveGame()
})

load.addEventListener('click', ()=>{
  loadGame()
})



function getSound() {
  let audio = new Audio(); 
  audio.src = './assets/audio/stone_touch_effect.mp3'; 
  audio.autoplay = true; 
}


sound.addEventListener('click', ()=>{
  if(soundFlag){
    soundFlag = false;
  } else {
    soundFlag = true;
  }

  sound.classList.toggle('sound__off')
})