
// Configuração do Canvas
const canvas = document.getElementById('canvas-game');
const ctx = canvas.getContext('2d');
canvas.width = 720; // Largura do canvas
canvas.height = 480; // Altura do canvas

// Configuração da câmera
const camera = {
    x: 0,        // Posição inicial da câmera
    y: 0,
    zoom: 3,     // Fator de zoom inicial
};

// Variáveis globais
let mapData, collisionGrid, mapWidth, mapHeight, tileWidth, tileHeight;
let isImageLoaded = false;
let isMapLoaded = false;
let gameOn = false;

// Carregar a imagem de fundo
const backgroundImage = new Image();
backgroundImage.src = '../img/mapa-autoria.png'; // Caminho para o PNG do mapa

// Desenhar o jogo após carregar o mapa
backgroundImage.onload = () => {
    isImageLoaded = true;
    if (isImageLoaded && isMapLoaded && player.loaded) {
        drawGame();
    }
};

// Carregar o arquivo JSON do mapa
fetch('../data/mapa-autoria.json') // Caminho para o arquivo JSON exportado do Tiled
    .then((response) => response.json())
    .then((data) => {
        mapData = data;
        const collisionLayer = mapData.layers.find(layer => layer.name === "Collision");

        // Converter a matriz 1D para 2D para facilitar a verificação
        collisionGrid = [];
        for (let i = 0; i < mapData.height; i++) {
            collisionGrid.push(collisionLayer.data.slice(i * mapData.width, (i + 1) * mapData.width));
        }

        mapWidth = mapData.width * mapData.tilewidth;
        mapHeight = mapData.height * mapData.tileheight;
        tileWidth = mapData.tilewidth;
        tileHeight = mapData.tileheight;

        isMapLoaded = true;
    });


// Função para desenhar o jogo
function drawGame() {

    if(!gameOn) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas

    // Ajustar zoom e deslocamento da câmera
    ctx.save();
    ctx.scale(camera.zoom, camera.zoom);
    ctx.translate(-camera.x, -camera.y);

    // Desenhar o fundo
    ctx.drawImage(backgroundImage, 0, 0, mapWidth, mapHeight);
    //Desenha player
    player.draw(ctx);
    drawEnemies(ctx);

    drawAllNPC(ctx);

    drawEnemies(ctx);

    ctx.restore();
}

setInterval(drawGame, 40 ); // Redesenha o jogo 60 vezes por segundo

// Atualizar a posição da câmera para seguir o jogador
function updateCamera() {
    camera.x = Math.max(0, Math.min(player.x + player.size / 2 - canvas.width / (2 * camera.zoom), mapWidth - canvas.width / camera.zoom));
    camera.y = Math.max(0, Math.min(player.y + player.size / 2 - canvas.height / (2 * camera.zoom), mapHeight - canvas.height / camera.zoom));
}

// Verificar colisão com a camada de tiles
//Velocidade do boneco (movimentação em x ou y) é 2
function isColliding(x, y) {

    const tileX2 = Math.floor((x + 8) / tileWidth);
    const tileY2 = Math.floor((y + 20) / tileHeight);
    const tileX1 = Math.floor((x + 14) / tileWidth);

    if (tileX2 >= mapData.width || tileY2 >= mapData.height) {
        return true; // Fora dos limites do mapa
    }

   // Verificar colisão com os NPCs
   for (let npc of npcs) {
        const npcRect = {
            left: npc.x,
            right: npc.x+2,
            top: npc.y,
            bottom: npc.y - 6
        };

        const playerRect = {
            left: x,
            right: x + player.width,
            top: y,
            bottom: y + player.height
        };

        if (playerRect.right > npcRect.left &&
            playerRect.left < npcRect.right &&
            playerRect.bottom > npcRect.top &&
            playerRect.top < npcRect.bottom) {
            return true;
        }
    }

    // Verificar colisão com os inimigos
    for (let enemy of enemies) {
        const enemyRect = {
            left: enemy.x+10,
            right: enemy.x+5,
            top: enemy.y+10,
            bottom: enemy.y
        };

        const playerRect = {
            left: x,
            right: x + player.width,
            top: y,
            bottom: y + player.height 
        };

        if (playerRect.right > enemyRect.left &&
            playerRect.left < enemyRect.right &&
            playerRect.bottom > enemyRect.top &&
            playerRect.top < enemyRect.bottom) {
            return true;
        }
    }

    return collisionGrid[tileY2][tileX2] !== 0 || collisionGrid[tileY2][tileX1] !== 0;
    
}


// Zoom in/out com '+' e '-'
//O ideal é que toda ação aqui esteja sendo feito com condição para que não haja drawGame sem necessidade
window.addEventListener('keydown', (e) => {
    if(!gameOn) return;

    updateCamera();
    
    if (e.key === '+') {
        camera.zoom = Math.min(camera.zoom + 0.1, 3); // Limite de zoom in
    } else if (e.key === '-') {
        camera.zoom = Math.max(camera.zoom - 0.1, 0.5); // Limite de zoom out
    }
});


const ganhou = () => {
    gameOn = false;
    const dialogBox = document.getElementById('dialogBox');
    dialogBox.innerText = "Parabéns! Você venceu!";
    dialogBox.style.color = 'white';
}

const perdeu = () => {
    gameOn = false;
    const dialogBox = document.getElementById('dialogBox');
    dialogBox.innerText = "Você perdeu! Tente novamente!";
    dialogBox.style.color = 'white';
}


document.getElementById('btn-jogar').addEventListener('click', () => {
    document.getElementById('tela-inicial').style.display = 'none';
    document.getElementById('canvas-game').style.display = 'block';
    gameOn = true;
    backgroundMusic.play();
});
