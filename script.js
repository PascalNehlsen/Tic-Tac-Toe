let fields = [null, null, null, null, null, null, null, null, null];
let currentPlayer = 'circle';
let winnerSound = new Audio('audio/winner.mp3');

function init() {
  render();
  displayCurrentPlayer();
}

function render() {
  fields = [null, null, null, null, null, null, null, null, null];
  currentPlayer = 'circle';
  document.getElementById('winner').innerHTML = '';
  const contentDiv = document.getElementById('content');
  if (!contentDiv) {
    console.error("Div container with id 'content' not found.");
    return;
  }

  let html = '<table>';
  for (let i = 0; i < 3; i++) {
    html += '<tr>';
    for (let j = 0; j < 3; j++) {
      const index = i * 3 + j;
      let symbol = '';
      if (fields[index] === 'circle') {
        symbol = generateCircleSVG();
      } else if (fields[index] === 'cross') {
        symbol = generateCrossSVG();
      }
      html += `<td onclick="handleClick(${index})">${symbol}</td>`;
    }
    html += '</tr>';
  }
  html += '</table>';

  contentDiv.innerHTML = html;
}

function displayCurrentPlayer() {
  const startDiv = document.getElementById('start');
  if (!startDiv) {
    console.error("Div container with id 'start' not found.");
    return;
  }

  const currentPlayerSymbol = currentPlayer === 'circle' ? generateCircleSVG() : generateCrossSVG();
  startDiv.innerHTML = `${currentPlayerSymbol} TURN`;
}

function checkWinner() {
  const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // horizontal
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // vertical
    [0, 4, 8],
    [2, 4, 6], // diagonal
  ];

  for (const condition of winConditions) {
    const [a, b, c] = condition;
    if (fields[a] !== null && fields[a] === fields[b] && fields[a] === fields[c]) {
      return { winner: fields[a], winningCells: condition };
    }
  }

  return { winner: null, winningCells: [] };
}

function drawWinningLine(winningCells) {
  const contentDiv = document.getElementById('content');
  const table = contentDiv.querySelector('table');
  const cells = table.querySelectorAll('td');

  const [a, b, c] = winningCells;
  const cellA = cells[a];
  const cellB = cells[b];
  const cellC = cells[c];

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', contentDiv.offsetWidth);
  svg.setAttribute('height', contentDiv.offsetHeight);
  svg.style.position = 'absolute';
  svg.style.zIndex = '1';

  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('stroke', '#ffffff');
  line.setAttribute('stroke-width', '5');
  line.setAttribute('stroke-linecap', 'round');

  svg.appendChild(line);
  contentDiv.appendChild(svg);

  const cellRectA = cellA.getBoundingClientRect();
  const cellRectC = cellC.getBoundingClientRect();

  const offsetX = contentDiv.offsetLeft + contentDiv.clientLeft;
  const offsetY = contentDiv.offsetTop + contentDiv.clientTop;

  const x1 = cellRectA.left + cellRectA.width / 2 - offsetX;
  const y1 = cellRectA.top + cellRectA.height / 2 - offsetY;
  const x2 = cellRectC.left + cellRectC.width / 2 - offsetX;
  const y2 = cellRectC.top + cellRectC.height / 2 - offsetY;

  line.setAttribute('x1', x1);
  line.setAttribute('y1', y1);
  line.setAttribute('x2', x2);
  line.setAttribute('y2', y2);
}

function handleClick(index) {
  const contentDiv = document.getElementById('content');
  const td = contentDiv.querySelectorAll('td')[index];
  if (fields[index] === null) {
    fields[index] = currentPlayer;
    td.innerHTML = currentPlayer === 'circle' ? generateCircleSVG() : generateCrossSVG();
    currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle'; // Wechsle den Spieler

    displayCurrentPlayer(); // Aktualisiere den angezeigten Spieler

    const { winner, winningCells } = checkWinner();
    if (winner) {
      drawWinningLine(winningCells);
      document.getElementById('winner').innerHTML = /*html*/ `
      Player ${winner} wins!
      <button class="againBtn" onclick="render()">Play again</button>
       `;
      document.getElementById('start').innerHTML = '';
      winnerSound.play();
    }
  } else {
    fields[index] = null;
    td.innerHTML = '';
  }
}

function generateCircleSVG() {
  const circleHTML = `
    <svg width="70" height="70" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg" style="display: block; margin: auto;">
        <circle cx="35" cy="35" r="30" fill="none" stroke="#00b0ef" stroke-width="5">
            <animate attributeName="r" from="0" to="30" dur="125ms" fill="freeze" />
        </circle>
    </svg>`;

  return circleHTML;
}

function generateCrossSVG() {
  const crossHTML = `
    <svg width="70" height="70" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg" style="display: block; margin: auto;">
        <line x1="10" y1="10" x2="60" y2="60" stroke="#ffc000" stroke-width="5">
            <animate attributeName="x2" from="0" to="60" dur="125ms" fill="freeze" />
        </line>
        <line x1="60" y1="10" x2="10" y2="60" stroke="#ffc000" stroke-width="5">
            <animate attributeName="x2" from="70" to="10" dur="125ms" fill="freeze" />
        </line>
    </svg>`;

  return crossHTML;
}
