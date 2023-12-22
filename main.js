const PLAYFIELD_COLUMNS = 10;
const PLAYFIELD_ROWS = 20;
const TETROMINO_NAMES = [
    "O"
];
const TETROMINOES = {
    "O": [
        [1, 1],
        [1, 1]
    ]
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
    const nameTetro = "O";
    const matrixTetro = TETROMINOES[nameTetro];

    const rowTetro = 3;
    const columnTetro = 5;

    tetromino = {
        name: nameTetro,
        matrix: matrixTetro,
        row: rowTetro,
        column: columnTetro,
    };
}

generatePlayfield();
generateTetromino();

const cells = document.querySelectorAll('.tetris div');
// console.log(cells);

function drowTetromino() {
    const name = tetromino.name;
    const tetrominoMatrixSize = tetromino.matrix.length;

    for(let row = 0; row < tetrominoMatrixSize; row +=1) {
        for(let column = 0; column < tetrominoMatrixSize; column +=1) {
            const cellIndex = convertPositionToIndex(tetromino.row + row, tetromino.column + column);
            cells[cellIndex].classList.add(name);
        };
    };
};

drowTetromino();

function drow() {
    cells.forEach(function(cell) {cell.removeAttribute('class')});
    drowTetromino();  
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
};

function moveTetrominoLeft() {
    tetromino.column -= 1;
};

function  moveTetrominoRight() {
    tetromino.column += 1;
};
