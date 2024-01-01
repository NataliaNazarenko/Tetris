const PLAYFIELD_COLUMNS = 10;
const PLAYFIELD_ROWS = 20;
const TETROMINO_NAMES = [
    "O",
    "L",
    "J",
    "I",
    "S",
    "T",
    "Z"
];
const TETROMINOES = {
    "O": [
        [1, 1],
        [1, 1]
    ],
    "L": [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1],
    ],
    "J": [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
    ],
    "I": [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
    ],
    "S": [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
    ],
    "T": [
        [1, 1, 1],
        [0, 1, 0],
        [0, 0, 0],
    ],
    "Z": [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
    ],
};

let playfield;
let tetromino;
let timeoutId;
let requestId;
let score = 0;
let isPaused = false;
let isGameOver = false;
const gameOverBlock = document.querySelector('.game-over');
const btnRestart = document.querySelector('.restart');

function convertPositionToIndex(row, column) {
    return row * PLAYFIELD_COLUMNS + column;
};

function randomColor() {
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);
 
    const color = "rgb(" + red + ", " + green + ", " + blue + ")";
    return color;
};

function generatePlayfield() {
    for(let i = 0; i < PLAYFIELD_ROWS * PLAYFIELD_COLUMNS; i+=1) {
        const div = document.createElement('div');
        document.querySelector('.tetris').append(div);
    };

    playfield = new Array(PLAYFIELD_ROWS).fill().map(() => new Array(PLAYFIELD_COLUMNS).fill(0));
    
};

function generateTetromino() {
    const randomIndex = Math.floor(Math.random() * TETROMINO_NAMES.length);
    const nameTetro = TETROMINO_NAMES[randomIndex];
    const matrixTetro = TETROMINOES[nameTetro];

    const startRow = -2;
    const startColumn = Math.floor(PLAYFIELD_COLUMNS / 2 - matrixTetro[0].length / 2);
    const colorTetro = randomColor();

    tetromino = {
        name: nameTetro,
        matrix: matrixTetro,
        row: startRow,
        column: startColumn,
        color: colorTetro,
    };
};

generatePlayfield();
generateTetromino();

const cells = document.querySelectorAll('.tetris div');


function drowPlayField() {
    for(let row = 0; row < PLAYFIELD_ROWS; row +=1) {
        for(let column = 0; column < PLAYFIELD_COLUMNS; column +=1) {
            // if(tetromino.matrix[row][column] == 0) continue;
            const name = playfield[row][column];
            const cellIndex = convertPositionToIndex(row, column);
            cells[cellIndex].classList.add(name);
        };
    };
}

function drowTetromino() {
    const { name, matrix, row, column, color } = tetromino;
    const tetrominoMatrixSize = matrix.length;
    for (let rowIdx = 0; rowIdx < tetrominoMatrixSize; rowIdx += 1) {
        for (let columnIdx = 0; columnIdx < tetrominoMatrixSize; columnIdx += 1) {
            if (isOutsideTopBoard(row)) continue;
            if (matrix[rowIdx][columnIdx] === 0) continue;
            const cellIndex = convertPositionToIndex(row + rowIdx, column + columnIdx);
            const cell = cells[cellIndex];
            if (cell) {
                cell.classList.add(name);
                cell.style.backgroundColor = color;
            };
        };
    };
};

function isOutsideTopBoard(row) {
    return tetromino.row + row < 0;
};

startLoop();

function drow() {
    cells.forEach(function (cell) {
        cell.className = '';
        cell.style.backgroundColor = '';
    });
    drowPlayField();
    drowTetromino();
};

document.addEventListener("keydown", onKeyDown);

function togglePausedGame() {
    if (isPaused) {
        startLoop();
        isPaused = false;
    } else {
        stopLoop();
        isPaused = true;
    };
};

function onKeyDown(event) {
    if(event.key == "Escape") {
        togglePausedGame();
    };

    if(isPaused) {
        return;
    };

    switch(event.key) {
        case " ":
            dropTetrominoDown();
            break;

        case "ArrowUp":
            rotateTetromino();
            break;

        case "ArrowDown":
            moveTetrominoDown();
            break;

        case "ArrowLeft":
            moveTetrominoLeft();
            break;

        case "ArrowRight":
            moveTetrominoRight();
            break;  
    };

    drow();
};

function dropTetrominoDown() {
    while(!isValid()) {
        tetromino.row += 1;
    };
    tetromino.row -= 1;
};

function moveTetrominoDown() {
    tetromino.row += 1;
    if (isValid()) {
        tetromino.row -= 1;
        placeTetromino();
    };
};

function moveTetrominoLeft() {
    tetromino.column -= 1;
    if (isValid()) {
        tetromino.column += 1;
    } else {
        drow();
    };
};

function moveTetrominoRight() {
    tetromino.column += 1;
    if (isValid()) {
        tetromino.column -= 1;
    } else {
        drow();
    };
};

function isValid() {
    const matrixSize = tetromino.matrix.length;
    for (let row = 0; row < matrixSize; row += 1) {
        for (let column = 0; column < matrixSize; column += 1) {
            if (tetromino.matrix[row][column] == 0) continue;
            if (isOutsideOfGameBoard(row, column)) {
                return true;
            };
            if (hasCollisions(row, column)) {
                return true;
            };
        };
    };
    return false;
};

function isOutsideOfGameBoard(row, column) {
    return (
        tetromino.column + column < 0 ||
        tetromino.column + column >= PLAYFIELD_COLUMNS ||
        tetromino.row + row >= PLAYFIELD_ROWS
    );
};

function hasCollisions(row, column) {
    const newRow = tetromino.row + row;
    const newColumn = tetromino.column + column;
    return playfield[newRow] && playfield[newRow][newColumn];
};

function placeTetromino() {
    const matrixSize = tetromino.matrix.length;
    for(let row = 0; row < matrixSize; row +=1) {
        for(let column = 0; column < matrixSize; column +=1) {
            if(!tetromino.matrix[row][column]) continue;
            if(isOutsideTopBoard(row)) {
                isGameOver = true;
                return;
            };
            playfield[tetromino.row + row][tetromino.column + column] = tetromino.name;
        };
    };
    const filledRows = findFilledRows();
    removeFillRows(filledRows);
    generateTetromino();
};

function countScore(destroyRows) {
    switch (destroyRows) {
        case 1:
            score += 10;
            break;
        case 2:
            score += 30;
            break;
        case 3:
            score += 50;
            break;
        case 3:
            score += 100;
            break;
        default:
            score += 0;
    };
    document.querySelector(".score").innerHTML = score;
};

function removeFillRows(filledRows) {
    filledRows.forEach(row => {
        dropRowsAbove(row);
    });
    countScore(filledRows.length);
};

function dropRowsAbove(rowDelete) {
    for(let row = rowDelete; row > 0; row-=1) {
        playfield[row] = playfield[row - 1];
    };
    playfield[0] = new Array(PLAYFIELD_COLUMNS).fill(0);
};

function findFilledRows() {
    const filledRows = [];
    for(let row = 0; row < PLAYFIELD_ROWS; row +=1) {
        let filledColumns = 0;
        for(let column = 0; column < PLAYFIELD_COLUMNS; column +=1) {
            if(playfield[row][column] !== 0) {
                filledColumns += 1;
            };
        };
        if(PLAYFIELD_COLUMNS === filledColumns) {
            filledRows.push(row);
        };
    };
    return filledRows;
};

function moveDown() {
    moveTetrominoDown();
    drow();
    stopLoop();
    startLoop();
    if(isGameOver) {
        gameOver();
    };
};

function gameOver() {
    isGameOver = true;
    stopLoop();
    gameOverBlock.style.display = "flex";
};


function startLoop() {
    timeoutId = setTimeout(
        () => (requestId = requestAnimationFrame(moveDown)),
        700
    );
};

function stopLoop() {
   cancelAnimationFrame(requestId);
    timeoutId = clearTimeout(timeoutId);
};


function rotateTetromino() {
    const oldMatrix = tetromino.matrix;
    const rotatedMatrix = rotateMatrix(tetromino.matrix);
    tetromino.matrix = rotatedMatrix;
    if (isValid()) {
        tetromino.matrix = oldMatrix;
    } else {
        drow();
    };
};

function rotateMatrix(matrixTetramino) {
    const N = matrixTetramino.length;
    const rotateMatrix = [];

    for(let i = 0; i < N; i+=1 ) {
        rotateMatrix[i] = [];
        for(let j = 0; j < N; j+=1) {
            rotateMatrix[i][j] = matrixTetramino[N - j - 1][i];
        };
    };
    return rotateMatrix;
};
