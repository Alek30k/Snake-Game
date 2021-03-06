// const cuadricula = new Array(20).fill(0).map(()=>new Array(20));

const SQUARE_SIZE = 20;
const GRID_HEIGHT = 20;
const GRID_WIDTH = 40;
const UP = 'up';
const DOWN = 'down';
const RIGHT = 'right';
const LEFT = 'left';

let speed = 3;
let counter = 0;

class World {
    
    update() {
       this.drowWalls(); 
    }

    drowWalls(){
        fill('brown')
        rect(0, 0, SQUARE_SIZE, SQUARE_SIZE * GRID_HEIGHT)
        rect(0, 0, SQUARE_SIZE * GRID_WIDTH, SQUARE_SIZE)
        rect(SQUARE_SIZE * (GRID_WIDTH -1), 0, SQUARE_SIZE, SQUARE_SIZE * GRID_HEIGHT)
        rect(0, SQUARE_SIZE * (GRID_HEIGHT -1), SQUARE_SIZE * GRID_WIDTH, SQUARE_SIZE)
    }
}

class SnakeSquare{
    constructor(life=3, isHead= false, initialPosition = [0,0]){
        this.life = life;
        this.isHead = isHead;
        this.position = initialPosition;
        this.counter = counter++;
    }

    draw() {
        //dibujar un cuadrito

        if(this.isHead){
            fill('#222222');
        } else {
            fill('#fff');
        }        

        square(
            this.position[0] * SQUARE_SIZE,
            this.position[1] * SQUARE_SIZE, 
            SQUARE_SIZE
        );
    }

    update() {
        //si la vida es 0, vamos a destruir
       
        this.life = this.life -1;

        // Checkear si hay colision con la comida

        //si elcuadrito is Head, creamos otro cuadrito y decimos que es head 

        //quitarle vida

        //llamar a draw
    }

    createHead(){
        //aqui creo otro cuadrito 
    }
}

class FoodGenerator {
    constructor(){
        this.position = [10, 10];
    }

    update() {
        this.draw();
    }

    draw() {

        fill('red');
        circle(
            this.position[0] * SQUARE_SIZE + SQUARE_SIZE/2,
            this.position[1] * SQUARE_SIZE + SQUARE_SIZE/2,
            SQUARE_SIZE
        );
    }

    teletransport() {
       this.position = [
          Math.round(Math.random() * (GRID_WIDTH - 3)) + 1,
          Math.round(Math.random() * (GRID_HEIGHT - 3)) + 1,
       ] 
    }
}


class Snake {
    constructor(){
        this.futureDirection = DOWN
        this.direction = DOWN;
        this.size = 4;
        this.score = 0;

        this.squares = [
            new SnakeSquare(4, true, [2, 2])
        ]

        this.food = new FoodGenerator();

        this.head = this.squares[0];
    }

    update() {
        // iterar por cada uno de los cuadritos
        this.squares.forEach((cuadrito, index) => {

            cuadrito.update();

            if (cuadrito.life === 0){
                this.squares.splice(index, 1)
            } else {
                cuadrito.draw();
            }

            this.checkBodyCollision(cuadrito);
        });

        this.updateHead();
        this.checkFoodCollision();
        this.checkWallCollision();
        this.food.update();
        // revisar si hay colision con el Head, en ese caso morir
    }

    updateHead(){
        this.direction = this.futureDirection
        const x = this.head.position[0];
        const y = this.head.position[1];

        let newX = x;
        if(this.direction === LEFT) {
            newX = x-1;
        } else if(this.direction === RIGHT) {
            newX = x+1;
        }

        let newY = y;
        if(this.direction === UP) {
            newY = y-1;
        } else if(this.direction === DOWN) {
            newY = y+1;
        }

        
        this.head.isHead = false;

        this.head = new SnakeSquare(
            this.size,
            true,
            [newX, newY]
        );
        this.squares.push(this.head)
    };

    checkFoodCollision() {
        const snakePositionX = this.head.position[0];
        const snakePositionY = this.head.position[1];

        const foodPositionX = this.food.position[0];
        const foodPositionY = this.food.position[1];

        if(snakePositionX === foodPositionX && snakePositionY === foodPositionY){
            this.addScore(1);
            this.food.teletransport();
            this.grow();
            speed += 1;
        }
    }

    checkBodyCollision(square){
        if(square.isHead) return;

        const snakeX = this.head.position[0];
        const snakeY = this.head.position[1];

        const squareX = square.position[0];
        const squareY = square.position[1];

        if(snakeX === squareX && snakeY === squareY){
            this.destroy();
        }
    }

    checkWallCollision() {
       const snakePositionX = this.head.position[0];
       const snakePositionY = this.head.position[1];

        if(snakePositionX === -1 || snakePositionX === GRID_WIDTH -1){
            this.destroy();
        }
        if(snakePositionY === -1 || snakePositionY === GRID_HEIGHT -1){
            this.destroy();
        }
    }

    changeDirection(direction) {
        if(this.direction === UP && direction === DOWN){
            return;
        };
        if(this.direction === DOWN && direction === UP){
            return;
        };
        if(this.direction === LEFT && direction === RIGHT){
            return;
        };
        if(this.direction === RIGHT && direction === LEFT){
            return;
        }


        this.futureDirection = direction
    }

    addScore(points = 1 ) {
        this.score += points;
    }

    grow(squares = 1) {
        this.size += squares
    }

    destroy() {
        alert(`Tu puntaje fue ${this.score}`)
        location.reload();
    }
}

let mundo;
let snake; 
let bg;


function preload() {
    bg = loadImage('image.png')
  }

function setup() {
    frameRate(speed);
    const canvasWidth = SQUARE_SIZE * GRID_WIDTH;
    const canvasHeight = SQUARE_SIZE * GRID_HEIGHT;
    createCanvas(canvasWidth, canvasHeight);
    background(153);


    snake = new Snake();
    mundo = new World();
    
}

function draw(){
    frameRate(speed);
    image(bg, 0, 0, 800, 800);
    snake.update();
    mundo.update();
}

function keyPressed() {
    if (keyCode === LEFT_ARROW){
       snake.changeDirection(LEFT)
    }  else if (keyCode === RIGHT_ARROW) {
        snake.changeDirection(RIGHT)
    } else if (keyCode === UP_ARROW) {
        snake.changeDirection(UP)
    } else if (keyCode === DOWN_ARROW) {
        snake.changeDirection(DOWN)
    }
} 