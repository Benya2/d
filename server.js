<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Game</title>
    <style>
        body { margin: 0; overflow: hidden; }
        canvas { display: block; background-color: #f0f0f0; }
    </style>
</head>
<body>
    <canvas id="gameCanvas"></canvas>
    <script>
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const ws = new WebSocket('ws://localhost:3000');
        const tanks = [];
        const bullets = [];
        let playerTank = null;

        ws.onopen = () => {
            console.log('WebSocket соединение установлено');
        };

        ws.onmessage = (event) => {
            const gameData = JSON.parse(event.data);
            console.log('Получены данные игры:', gameData);
            updateGame(gameData);
        };

        function updateGame(gameData) {
            tanks.length = 0;
            bullets.length = 0;
            gameData.tanks.forEach(tank => tanks.push(tank));
   
