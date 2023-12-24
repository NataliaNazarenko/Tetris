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
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
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
        [0, 1, 0],
        [1, 1, 0],
    ],
    "T": [
        [1, 1, 1],
        [0, 1, 0],
        [0, 1, 0],
    ],
    "Z": [
        [1, 1, 0],
        [0, 1, 0],
        [0, 1, 1],
    ],
};

let playfield;
let tetromino;

function convertPositionToIndex(row, column) {
    return row * PLAYFIELD_COLUMNS + column;
};

function generatePlayfield() {
    for(let i = 0; i < PLAYFIELD_ROWS * PLAYFIELD_COLUMNS; i+=1) {
        const div = document.createElement('div');
        document.querySelector('.tetris').append(div);
    };

    playfield = new Array(PLAYFIELD_ROWS).fill().map(() => new Array(PLAYFIELD_COLUMNS).fill(0));
    // console.log(playfield);
};

function generateTetromino() {
    const randomIndex = Math.floor(Math.random() * TETROMINO_NAMES.length);
    const nameTetro = TETROMINO_NAMES[randomIndex];
    const matrixTetro = TETROMINOES[nameTetro];

    const startRow = 0;
    const startColumn = Math.floor((PLAYFIELD_COLUMNS - matrixTetro[0].length) / 2);


    tetromino = {
        name: nameTetro,
        matrix: matrixTetro,
        row: startRow,
        column: startColumn,
    };
};

generatePlayfield();
generateTetromino();

const cells = document.querySelectorAll('.tetris div');
// console.log(cells);

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
    const name = tetromino.name;
    const tetrominoMatrixSize = tetromino.matrix.length;

    for(let row = 0; row < tetrominoMatrixSize; row +=1) {
        for(let column = 0; column < tetrominoMatrixSize; column +=1) {
            if(tetromino.matrix[row][column] == 0) continue;
            const cellIndex = convertPositionToIndex(tetromino.row + row, tetromino.column + column);
            cells[cellIndex].classList.add(name);
        };
    };
};

drowTetromino();

function drow() {
    cells.forEach(function(cell) {cell.removeAttribute('class')});
    drowPlayField();
    drowTetromino();
    console.table(playfield);
};

document.addEventListener("keydown", onKeyDown);

function onKeyDown(event) {
    switch(event.key) {
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

function moveTetrominoDown() {
    tetromino.row += 1;
    if(isOutsideOfGameBoard()) {
        tetromino.row -= 1;
        placeTetromino();
    };
};

function moveTetrominoLeft() {
    tetromino.column -= 1;
    if(isOutsideOfGameBoard()) {
        tetromino.column += 1;
    };
};

function  moveTetrominoRight() {
    tetromino.column += 1;
    if(isOutsideOfGameBoard()) {
        tetromino.column -= 1;
    };
};

function isOutsideOfGameBoard() {
    const matrixSize = tetromino.matrix.length;
    for(let row = 0; row < matrixSize; row +=1) {
        for(let column = 0; column < matrixSize; column +=1) {
            if(tetromino.matrix[row][column] == 0) continue;
            if(tetromino.column + column < 0 || tetromino.column + column >= PLAYFIELD_COLUMNS || tetromino.row + row >= playfield.length) {
                return true;
            };
        };
    };
    return false;
};

function placeTetromino() {
    const matrixSize = tetromino.matrix.length;
    for(let row = 0; row < matrixSize; row +=1) {
        for(let column = 0; column < matrixSize; column +=1) {
            if(!tetromino.matrix[row][column]) continue;
            playfield[tetromino.row + row][tetromino.column + column] = TETROMINO_NAMES[0];
        };
    };
    generateTetromino();
};
