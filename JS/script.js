const boardElement = document.getElementById('board');
const restartBtn = document.getElementById('restartBtn');
const difficultyBtn = document.getElementById('difficultyBtn');
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let isGameActive = true;
let difficultyLevel = 1; // 1: Fácil, 2: Difícil

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

function createCell(index) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.setAttribute('data-index', index);
    cell.addEventListener('click', handleCellClick);
    return cell;
}

function initBoard() {
    boardElement.innerHTML = '';
    board.forEach((_, index) => {
        boardElement.appendChild(createCell(index));
    });
}

function handleCellClick(event) {
    const index = event.target.getAttribute('data-index');
    if (board[index] || !isGameActive) return;

    board[index] = currentPlayer;
    event.target.innerText = currentPlayer;
    checkResult();
    if (isGameActive) {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        if (currentPlayer === 'O') aiPlay();
    }
}

function checkResult() {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            alert(`${board[a]} venceu!`);
            isGameActive = false;
            drawWinningLine(condition);
            return;
        }
    }

    if (!board.includes('')) {
        alert('Empate!');
        isGameActive = false;
    }
}

function drawWinningLine(condition) {
    const line = document.createElement('div');
    line.classList.add('line');

    const [a, b, c] = condition;
    const cellA = document.querySelector(`.cell[data-index="${a}"]`);
    const cellB = document.querySelector(`.cell[data-index="${b}"]`);
    const cellC = document.querySelector(`.cell[data-index="${c}"]`);

    if (a === b && b === c) {
        // Horizontal
        line.classList.add('horizontal');
        line.style.top = `${cellA.offsetTop + 45}px`; // Alinha a linha no centro vertical
        line.style.left = `${cellA.offsetLeft}px`;
    } else if (a === b) {
        // Vertical
        line.classList.add('vertical');
        line.style.left = `${cellA.offsetLeft + 45}px`; // Alinha a linha no centro horizontal
        line.style.top = `${cellA.offsetTop}px`;
    } else if (a === c) {
        // Diagonal da esquerda para a direita
        line.classList.add('diagonal-left');
        line.style.left = `${cellA.offsetLeft}px`;
        line.style.top = `${cellA.offsetTop}px`;
        line.style.height = `${Math.sqrt(2) * 100}px`; // Comprimento da diagonal
        line.style.transform = `rotate(45deg)`;
    } else if (b === c) {
        // Diagonal da direita para a esquerda
        line.classList.add('diagonal-right');
        line.style.left = `${cellB.offsetLeft}px`;
        line.style.top = `${cellB.offsetTop}px`;
        line.style.height = `${Math.sqrt(2) * 100}px`; // Comprimento da diagonal
        line.style.transform = `rotate(-45deg)`;
    }

    document.body.appendChild(line);
}

function aiPlay() {
    let indexToPlay;

    if (difficultyLevel === 2) {
        indexToPlay = getBestMove(); // Joga melhor na dificuldade alta
    } else {
        const availableSpots = board.map((value, index) => value === '' ? index : null).filter(val => val !== null);
        indexToPlay = availableSpots[Math.floor(Math.random() * availableSpots.length)]; // Joga aleatoriamente
    }

    board[indexToPlay] = currentPlayer;
    const cell = document.querySelector(`.cell[data-index="${indexToPlay}"]`);
    cell.innerText = currentPlayer;
    checkResult();
    if (isGameActive) currentPlayer = 'X';
}

function getBestMove() {
    // Verifica se a IA pode vencer
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (board[a] === 'O' && board[b] === 'O' && board[c] === '') return c;
        if (board[a] === 'O' && board[c] === 'O' && board[b] === '') return b;
        if (board[b] === 'O' && board[c] === 'O' && board[a] === '') return a;
    }

    // Verifica se o jogador pode vencer e bloqueia
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (board[a] === 'X' && board[b] === 'X' && board[c] === '') return c;
        if (board[a] === 'X' && board[c] === 'X' && board[b] === '') return b;
        if (board[b] === 'X' && board[c] === 'X' && board[a] === '') return a;
    }

    // Caso não haja ameaças ou oportunidades, joga aleatoriamente
    const availableSpots = board.map((value, index) => value === '' ? index : null).filter(val => val !== null);
    return availableSpots[Math.floor(Math.random() * availableSpots.length)];
}

restartBtn.addEventListener('click', () => {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    isGameActive = true;
    initBoard();
    const existingLines = document.querySelectorAll('.line');
    existingLines.forEach(line => line.remove()); // Remove linhas antigas
});

difficultyBtn.addEventListener('click', () => {
    difficultyLevel = difficultyLevel === 1 ? 2 : 1;
    alert(`Dificuldade ${difficultyLevel === 1 ? 'Fácil' : 'Difícil'}`);
});

initBoard();
