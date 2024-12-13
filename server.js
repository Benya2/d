const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const tanks = [];
const bullets = [];

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

function createBullet(tank) {
  const bullet = {
    x: tank.x,
    y: tank.y,
    angle: tank.angle,
    speed: 5,
  };
  bullets.push(bullet);
}

function moveBullets() {
  for (const bullet of bullets) {
    bullet.x += Math.cos(bullet.angle * Math.PI / 180) * bullet.speed;
    bullet.y += Math.sin(bullet.angle * Math.PI / 180) * bullet.speed;
  }
}

function sendGameData() {
  const gameData = {
    tanks,
    bullets,
  };
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(gameData));
    }
  });
}

wss.on('connection', ws => {
  console.log('Клиент подключился');
  
  let playerId = `player-${Date.now()}`;
  const playerTank = {
    id: playerId,
    x: 400,
    y: 300,
    angle: 0,
    isBot: false,
  };
  tanks.push(playerTank);
  console.log(`Создан новый танк: ${playerId}`);

  ws.on('message', message => {
    const data = JSON.parse(message);
    console.log('Получены данные от клиента:', data);

    if (data.type === 'move') {
      const playerTank = tanks.find(tank => tank.id === data.id);
      if (playerTank) {
        playerTank.x = data.x;
        playerTank.y = data.y;
        playerTank.angle = data.angle;
      }
    }

    if (data.type === 'shoot') {
      const playerTank = tanks.find(tank => tank.id === data.id);
      if (playerTank) {
        createBullet(playerTank);
        console.log(`Пуля от игрока ${data.id}`);
      }
    }
  });

  const interval = setInterval(() => {
    moveBullets();
    sendGameData();
  }, 50);

  ws.on('close', () => {
    clearInterval(interval);
    console.log('Клиент отключился');
    const index = tanks.findIndex(tank => tank.id === playerId);
    if (index !== -1) {
      tanks.splice(index, 1);
    }
  });
});

server.listen(3000, () => {
  console.log('Сервер работает на http://localhost:3000');
});
