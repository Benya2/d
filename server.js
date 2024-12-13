const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

let tanks = [];  // Массив для хранения данных о танках

wss.on('connection', ws => {
  console.log('Клиент подключился');
  
  // Создаем новый танк для каждого игрока
  const playerId = `player-${Date.now()}`;
  const letter = String.fromCharCode(65 + (tanks.length % 26)); // Генерация буквы
  const playerTank = {
    id: playerId,
    x: 400,
    y: 300,
    angle: 0,
    letter: letter, // Буква игрока
  };
  tanks.push(playerTank);

  // Отправляем данные о всех танках каждому подключенному клиенту
  ws.send(JSON.stringify({ tanks }));

  // Обработка сообщений от клиента
  ws.on('message', message => {
    const data = JSON.parse(message);
    if (data.type === 'move') {
      const playerTank = tanks.find(tank => tank.id === data.id);
      if (playerTank) {
        playerTank.x = data.x;
        playerTank.y = data.y;
        playerTank.angle = data.angle;
      }
    }
  });

  // Отправка обновленных данных о танках всем клиентам
  const interval = setInterval(() => {
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ tanks }));
      }
    });
  }, 50);  // Отправляем обновления каждый 50 миллисекунд

  ws.on('close', () => {
    clearInterval(interval);
    console.log('Клиент отключился');
    const index = tanks.findIndex(tank => tank.id === playerId);
    if (index !== -1) {
      tanks.splice(index, 1);
    }
  });
});
