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

const pause = document.createElement('button');
pause.className = 'game__buton';
pause.innerHTML = 'Stop';
buttons.append(pause);

const save = document.createElement('button');
save.className = 'game__buton';
save.innerHTML = 'Save';
buttons.append(save);

const results = document.createElement('button');
results.className = 'game__buton';
results.innerHTML = 'Results';
buttons.append(results);

const info = document.createElement('div');
info.className = 'game__info';
header.append(info);

const counter = document.createElement('p');
counter.className = 'game__counter';
let count = 0;
counter.innerHTML = `Moves: ${count}`;
info.append(counter);

const timer = document.createElement('p');
let time = '00:00';
timer.innerHTML = `Time: ${time}`;
timer.className = 'game__timer';
info.append(timer);


const wraper = document.createElement('div');
wraper.className = 'game__wraper';
game.append(wraper);


start.addEventListener("click",()=>{
	wraper.firstChild.remove()
	newGame();
	count = 0;
	counter.innerHTML = `Moves: ${count}`;
})



function newGame() {
  const field = document.createElement('div');
  field.className = 'game__field';
  wraper.append(field);

  const numbers = Array.from(new Array(15).keys()).sort(
    () => Math.random() - 0.5
  )

  const cells = [];

  const empty = {
    top: 0,
    left: 0,
    value: 0,
  };

  cells.push(empty);

  for (let i = 1; i <= 15; i++) {
    const cell = document.createElement('div');
    cell.className = 'game__cell';
    cell.innerHTML = numbers[i - 1] + 1;

    const left = i % 4;
    const top = (i - left) / 4;
    const value = numbers[i - 1] + 1;

    cell.style.left = `${left * 100}px`;
    cell.style.top = `${top * 100}px`;

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
    const cell = cells[index];

    if (Math.abs(empty.left - cell.left) + Math.abs(empty.top - cell.top) > 1) {
      return;
    } else {
      cell.element.style.left = `${empty.left * 100}px`;
      cell.element.style.top = `${empty.top * 100}px`;

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
      for (let i = 1; i <= 15; i++) {
        if (cells[i].value !== cells[i].top * 4 + cells[i].left + 1) {
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


newGame();

const footer = document.createElement('div');
footer.className = 'game__footer';
game.append(footer);

const label = document.createElement('label');
label.className = 'game__label';
label.innerText = 'Frame size:'
footer.append(label);


const select = document.createElement('select')
select.className = 'game__select'
footer.append(select)


for(let i = 0; i < 6; i++){
	let fieldSize = [['3x3',3],['4x4',4],['5x5',5],['6x6',6],['7x7',7],['8x8',8]];
	const option = document.createElement('option')
	option.className = 'game__option'
	option.innerHTML = fieldSize[i][0]
	option.value = fieldSize[i][1]
	select.append(option)
}







