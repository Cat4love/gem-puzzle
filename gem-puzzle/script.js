const container = document.createElement('div');
container.className = 'container';
document.body.append(container);

function newGame() {
  const game = document.createElement('div');
  game.className = 'game';
  container.append(game);

  const numbers = Array.from(new Array(15).keys()).sort(
    () => Math.random() - 0.5
  );

  const cells = [];

  const empty = {
    top: 0,
    left: 0,
    value: 0,
  };

  cells.push(empty);

  for (let i = 1; i <= 15; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
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

    game.append(cell);

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
