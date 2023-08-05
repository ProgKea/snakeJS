////////////////////
// Global variables

// NOTE: If this causes issues later, because of things not being loaded.
// Put this inside window.onload.
const CANVAS = getElementByIdOrError("app");
const DEFAULT_CANVAS_SIZE = 500;
CANVAS.width = DEFAULT_CANVAS_SIZE;
CANVAS.height = DEFAULT_CANVAS_SIZE;
const CTX = CANVAS.getContext("2d");
const CELL_SIZE = 10; // TODO: make the cell size customizable

function getElementByIdOrError(id) {
    const element = document.getElementById(id);
    if (element === null) {
        throw new Error(`Could not find element with id: "${id}"`);
    }
    return element;
}

function drawBoard(x, y, cellSize, foregroundColor, backgroundColor) {
    // for now assert that the canvas is a sqare
    console.assert(CANVAS.width === CANVAS.height);
    // for now assert that the canvas width is divisible by the cellSize
    console.assert(CANVAS.width % cellSize === 0);

    const cellRowCount = CANVAS.width / cellSize;
    const cellColCount = CANVAS.height / cellSize;

    CTX.fillStyle = backgroundColor;
    CTX.fillRect(x, y,  cellRowCount * cellSize, cellColCount * cellSize);
}

window.onload = () => {
    drawBoard(0, 0, 10, "black", "white");
};
