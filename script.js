const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Устанавливаем размер канваса
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Параметры танка
let tank = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 50,
    height: 30,
    color: 'green',
    angle: 0,
    speed: 5
};

// Обработка нажатий клавиш
let keys = {};
document.addEventListener('keydown', (event) => {
    keys[event.key] = true;
});
document.addEventListener('keyup', (event) => {
    keys[event.key] = false;
});

// Отрисовка танка
function drawTank(tank) {
    ctx.save();
    ctx.translate(tank.x, tank.y);
    ctx.rotate(tank.angle);

    ctx.fillStyle = tank.color;
    ctx.fillRect(-tank.width / 2, -tank.height / 2, tank.width, tank.height);

    ctx.fillStyle = 'black';
    ctx.fillRect(0, -5, tank.width / 2, 10);

    ctx.restore();
}

// Логика движения
function update() {
    if (keys['ArrowUp']) {
        tank.x += Math.cos(tank.angle) * tank.speed;
        tank.y += Math.sin(tank.angle) * tank.speed;
    }
    if (keys['ArrowDown']) {
        tank.x -= Math.cos(tank.angle) * tank.speed;
        tank.y -= Math.sin(tank.angle) * tank.speed;
    }
    if (keys['ArrowLeft']) {
        tank.angle -= 0.05;
    }
    if (keys['ArrowRight']) {
        tank.angle += 0.05;
    }
}

// Основной цикл игры
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    update();
    drawTank(tank);
    requestAnimationFrame(gameLoop);
}

gameLoop();
