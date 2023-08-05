////////////////////
// Global variables

// NOTE: If this causes issues later, because of things not being loaded.
// Put this inside window.onload.
const CANVAS = getElementByIdOrError("app");
const DEFAULT_CANVAS_SIZE = 500;
CANVAS.width = DEFAULT_CANVAS_SIZE;
CANVAS.height = DEFAULT_CANVAS_SIZE;
const CTX = CANVAS.getContext("2d");
const CELL_SIZE = 20;

function getElementByIdOrError(id) {
    const element = document.getElementById(id);
    if (element === null) {
        throw new Error(`Could not find element with id: "${id}"`);
    }
    return element;
}

function getCellCount(cellSize) {
    return new Vector(CANVAS.width / cellSize, CANVAS.height / cellSize);
}

function drawGrid(x, y, cellSize, color) {
    // for now assert that the canvas is a sqare
    console.assert(CANVAS.width === CANVAS.height);
    // for now assert that the canvas width is divisible by the cellSize
    console.assert(CANVAS.width % cellSize === 0);

    const cellCount = getCellCount(cellSize);

    // Draw the grid
    CTX.strokeStyle = color;
    for (let col = 0; col < cellCount.y; ++col) {
        for (let row = 0; row < cellCount.x; ++row) {
            CTX.strokeRect(row * cellSize, col * cellSize, cellSize, cellSize);
        }
    }
}

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(vec) {
        this.x += vec.x;
        this.y += vec.y;
    }

    cmp(v1) {
        return this.x === v1.x && this.y === v1.y;
    }

    isOpposite(v1) {
        return this.cmp(new Vector(-v1.x, -v1.y));
    }

    invert() {
        this.x *= -1;
        this.y *= -1;
    }

    getInvert() {
        return new Vector(-this.x, -this.y);
    }
}

const DIRECTION = {
    left  : new Vector(-1, 0),
    right : new Vector(1, 0),
    up    : new Vector(0, -1),
    down  : new Vector(0, 1),
};

class Snake {
    constructor() {
        this.headColor = "white";
        this.tailColor = "lightgreen";
        this.dead = false;
        this.direction = DIRECTION.right;
        this.nodes = [new Vector(1, 0), new Vector(0, 0)];
    }

    draw() {
        for (let ni = 0; ni < this.nodes.length; ++ni) {
            CTX.fillStyle = ni === 0 ? this.headColor : this.tailColor;
            CTX.fillRect(this.nodes[ni].x * CELL_SIZE, this.nodes[ni].y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
    }

    update() {
        if (this.nodes.length > 1) {
            let prevPosition = new Vector();
            for (let ni = this.nodes.length-1; ni > 0; --ni) {
                this.nodes[ni].x = this.nodes[ni-1].x;
                this.nodes[ni].y = this.nodes[ni-1].y;
            }
        }

        const cellCount = getCellCount(CELL_SIZE);
        if (this.nodes[0].x + this.direction.x >= cellCount.x ||
            this.nodes[0].y + this.direction.y >= cellCount.y ||
            this.nodes[0].x + this.direction.x < 0 ||
            this.nodes[0].y + this.direction.y < 0) {
            this.dead = true;
            return;
        }
        this.nodes[0].add(this.direction);
        if (this.isInsideTail(this.nodes[0])) {
            this.dead = true;
        }
    }

    isInside(cell) {
        return this.nodes.some((e) => e.cmp(cell));
    }

    isInsideTail(cell) {
        return this.nodes.slice(1).some((e) => e.cmp(cell));
    }
}

function clear(color) {
    CTX.fillStyle = color;
    CTX.fillRect(0, 0, CANVAS.width, CANVAS.height);
}

function getRandomCell() {
    const cellCount = getCellCount(CELL_SIZE);
    return new Vector(Math.floor(Math.random() * cellCount.x),
                      Math.floor(Math.random() * cellCount.y));
}

class Game {
    constructor() {
        this.snake = new Snake();
        this.score = 0;
        this.genNewApple();
        this.appleColor = "red";
    }

    genNewApple() {
        let newApple = getRandomCell();
        while (this.snake.isInside(newApple)) {
            newApple = getRandomCell();
        }
        this.apple = newApple;
    }

    draw() {
        clear("green");
        this.snake.draw();
        CTX.fillStyle = this.appleColor;
        CTX.fillRect(this.apple.x * CELL_SIZE, this.apple.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        drawGrid(0, 0, CELL_SIZE, "black");
    }

    update(lastKey) { // TODO: Maybe rename this function to something like: frame
        if (this.snake.dead) return; // TODO: Create a main menu

        switch (lastKey) {
        case "ArrowLeft":
            this.changeDirection(DIRECTION.left);
            break;
        case "ArrowRight":
            this.changeDirection(DIRECTION.right);
            break;
        case "ArrowUp":
            this.changeDirection(DIRECTION.up);
            break;
        case "ArrowDown":
            this.changeDirection(DIRECTION.down);
            break;
        }

        this.snake.update();
        if (this.snake.isInside(this.apple)) {
            this.scoreIncrease(1);
            this.genNewApple();
            this.draw();
        }

        this.draw();
    }

    changeDirection(new_direction) {
        if (this.snake.direction.isOpposite(new_direction)) return;
        this.snake.direction = new_direction;
    }

    scoreIncrease(score) {
        this.score += score;
        const newNode = new Vector();
        this.snake.nodes.push(newNode);
    }
}

window.onload = () => {
    const game = new Game();
    let lastKey;
    document.addEventListener("keydown", (e) => lastKey = e.key);
    setInterval(() => game.update(lastKey), 100);
};
