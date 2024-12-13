const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const ws = new WebSocket('ws://localhost:8080');

let playerTank = null;
let tanks = [];

ws.onopen = () => {
  console.log('Подключено к серверу');
};

ws.onmessage = (event) => {
  const gameData = JSON.parse(event.data);
  updateGame(gameData);
};

document.addEventListener('keydown', (event) => {
  if (!playerTank) return;

  if (event.key === 'ArrowUp') {
    playerTank.x += Math.cos(playerTank.angle * Math.PI / 180) * 5;
    playerTank.y += Math.sin(playerTank.angle * Math.PI / 180) * 5;
  } else if (event.key === 'ArrowDown') {
    playerTank.x -= Math.cos(playerTank.angle * Math.PI / 180) * 5;
    playerTank.y -= Math.sin(playerTank.angle * Math.PI / 180) * 5;
  } else if (event.key === 'ArrowLeft') {
    playerTank.angle -= 5;
  } else if (event.key === 'ArrowRight') {
    playerTank.angle += 5;
  }

  // Отправляем обновления о движении на сервер
  if (playerTank) {
    ws.send(JSON.stringify({
      type: 'move',
      id: playerTank.id,
      x: playerTank.x,
      y: playerTank.y,
      angle: playerTank.angle
    }));
  }
});

function updateGame(gameData) {
  tanks = gameData.tanks;
  drawGame();
}

function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  tanks.forEach(tank => {
    ctx.save();
    ctx.translate(tank.x, tank.y);
    ctx.rotate(tank.angle * Math.PI / 180);
    ctx.font = "30px Arial";
    ctx.fillStyle = 'green';
    ctx.fillText(tank.letter, -15, 10); // Рисуем букву игрока
    ctx.restore();
  });
}
