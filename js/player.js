// Player
const player = {
    x: 44,   // Posição inicial X do jogador
    y: 48,   // Posição inicial Y do jogador
    speed: 2, // Velocidade do jogador
    image: new Image(),
    frameX: 1,       // Coluna atual na grade de sprites
    frameY: 3,       // Linha atual na grade de sprites
    frameWidth: 48,  // Largura de cada quadro na imagem de sprites
    frameHeight: 48,
    loaded: false,
    size: 18,
    width: 14,
    height: 20, 
    life: 3,
    lifeIcon: new Image(),
    draw(ctx) {
        // Desenhar o jogador usando o quadro atual da imagem de sprites
        if (player.loaded) {
            if (player.frameY === 0) { // Movimento para a esquerda
                ctx.save();
                ctx.scale(-1, 1); // Espelhar horizontalmente
                ctx.drawImage(
                    player.image,
                    player.frameX * player.frameWidth, // Posição X do tile na imagem
                    4 * player.frameHeight, // Posição Y do tile na imagem (usando a linha de movimento para a direita)
                    player.frameWidth, // Largura do tile
                    player.frameHeight, // Altura do tile
                    -(player.x + 24), // Posição X no canvas (ajustada para espelhamento)
                    player.y, // Posição Y no canvas
                    24, // Largura do tile no canvas
                    24 // Altura do tile no canvas
                );
                ctx.restore();
            } else if(player.frameY === 6 || player.frameY === 7 || player.frameY === 8) { // Ataque para baixo ou direita
                if(player.frameX <= 2) {   
                    ctx.drawImage(
                        player.image,
                        player.frameX * player.frameWidth, // Posição X do tile na imagem
                        player.frameY * player.frameHeight, // Posição Y do tile na imagem
                        player.frameWidth, // Largura do tile
                        player.frameHeight, // Altura do tile
                        player.x, // Posição X no canvas
                        player.y, // Posição Y no canvas
                        24, // Largura do tile no canvas
                        24 // Altura do tile no canvas
                    );
    
                    setTimeout(function() {player.frameX = player.frameX + 1;}, 120);
                } else {
                    ctx.drawImage(
                        player.image,
                        player.frameX * player.frameWidth, // Posição X do tile na imagem
                        player.frameY * player.frameHeight, // Posição Y do tile na imagem
                        player.frameWidth, // Largura do tile
                        player.frameHeight, // Altura do tile
                        player.x, // Posição X no canvas
                        player.y, // Posição Y no canvas
                        24, // Largura do tile no canvas
                        24 // Altura do tile no canvas
                    );   
                    player.frameX = 0;

                    if(player.frameY === 6) {
                        player.frameY = 3;
                    } else if(player.frameY === 7) {
                        player.frameY = 1;
                    } else if(player.frameY === 8) {
                        player.frameY = 5;
                    } else {
                        player.frameY = 0;
                    }
                }
                this.verifyIfKill();
                swordCutMusic.play();
            } else if (player.frameY === 9) {
                if(player.frameX <= 2) {   
                    ctx.save();
                    ctx.scale(-1, 1); // Espelhar horizontalmente
                    ctx.drawImage(
                        player.image,
                        player.frameX * player.frameWidth, // Posição X do tile na imagem
                        7 * player.frameHeight, // Posição Y do tile na imagem (usando a linha de movimento para a direita)
                        player.frameWidth, // Largura do tile
                        player.frameHeight, // Altura do tile
                        -(player.x + 24), // Posição X no canvas (ajustada para espelhamento)
                        player.y, // Posição Y no canvas
                        24, // Largura do tile no canvas
                        24 // Altura do tile no canvas
                    );
                    ctx.restore();
                    setTimeout(function() {player.frameX = player.frameX + 1;}, 120);
                } else {
                    ctx.save();
                    ctx.scale(-1, 1); // Espelhar horizontalmente
                    ctx.drawImage(
                        player.image,
                        player.frameX * player.frameWidth, // Posição X do tile na imagem
                        7 * player.frameHeight, // Posição Y do tile na imagem (usando a linha de movimento para a direita)
                        player.frameWidth, // Largura do tile
                        player.frameHeight, // Altura do tile
                        -(player.x + 24), // Posição X no canvas (ajustada para espelhamento)
                        player.y, // Posição Y no canvas
                        24, // Largura do tile no canvas
                        24 // Altura do tile no canvas
                    );
                    ctx.restore();
                    player.frameX = 1;
                    if(player.frameY === 6) {
                        player.frameY = 3;
                    } else if(player.frameY === 7) {
                        player.frameY = 1;
                    } else if(player.frameY === 8) {
                        player.frameY = 5;
                    } else {
                        player.frameY = 0;
                    }
                }
                this.verifyIfKill();
                swordCutMusic.play();
            } else {
                ctx.drawImage(
                    player.image,
                    player.frameX * player.frameWidth, // Posição X do tile na imagem
                    player.frameY * player.frameHeight, // Posição Y do tile na imagem
                    player.frameWidth, // Largura do tile
                    player.frameHeight, // Altura do tile
                    player.x, // Posição X no canvas
                    player.y, // Posição Y no canvas
                    24, // Largura do tile no canvas
                    24 // Altura do tile no canvas
                );
            }

            drawLife(); // Desenhar ícones de vida
        } else {
            console.warn("Imagem do jogador ainda não carregada!");
        }
        
    },
    verifyIfKill() {
        for (let enemy of enemies) {
            if (!enemy.isAlive) continue;

            const playerRect = {
                left: player.x,
                right: player.x + player.width,
                top: player.y,
                bottom: player.y + player.height
            };

            const enemyRect = {
                left: enemy.x,
                right: enemy.x + enemy.width,
                top: enemy.y+8,
                bottom: enemy.y + 10
            };

            if (player.frameY === 6 && playerRect.bottom > enemyRect.top && playerRect.top < enemyRect.bottom && playerRect.right > enemyRect.left && playerRect.left < enemyRect.right) {
                enemy.kill();
            } else if (player.frameY === 7 && playerRect.bottom > enemyRect.top && playerRect.top < enemyRect.bottom && playerRect.right > enemyRect.left && playerRect.left < enemyRect.right) {
                enemy.kill();
            } else if (player.frameY === 8 && playerRect.bottom > enemyRect.top && playerRect.top < enemyRect.bottom && playerRect.right > enemyRect.left && playerRect.left < enemyRect.right) {
                enemy.kill();
            } else if (player.frameY === 9 && playerRect.bottom > enemyRect.top && playerRect.top < enemyRect.bottom && playerRect.right > enemyRect.left && playerRect.left < enemyRect.right) {
                enemy.kill();
            }

            if(enemies.filter(enemy => enemy.isAlive).length === 0) {
                ganhou();
            }
        }
    }   // Altura de cada quadro na imagem de sprites
};

player.image.src = '../img/player.png';
player.image.onload = () => {
    player.loaded = true; // Marca a imagem como carregada
};

player.lifeIcon.src = '../img/life.png';
const drawLife = () => {
    // Desenhar ícones de vida
    for (let i = 0; i < player.life; i++) {
        ctx.drawImage(
            player.lifeIcon,
            camera.x + 5 + 15 * i, camera.y + 5, // Posição X e Y no canvas ajustada pela câmera
            12, 12 // Largura e altura no canvas
        );
    }

    if (player.life <= 0) {
        perdeu();
    }
}

// Movimentação do jogador
window.addEventListener('keydown', (e) => {
    if (!gameOn) return;

    let nextX = player.x;
    let nextY = player.y;

    if (e.key === 'w' || e.key === 'W') {
        nextY -= player.speed;
        player.frameY = 5; // Linha 3 representa o movimento para cima
    }

    if (e.key === 's' || e.key === 'S') {
        nextY += player.speed;
        player.frameY = 3; // Linha 0 representa o movimento para baixo
    }

    if (e.key === 'a' || e.key === 'A') {
        nextX -= player.speed;
        player.frameY = 0; // Linha 1 representa o movimento para a esquerda
    }

    if (e.key === 'd' || e.key === 'D') {
        nextX += player.speed;
        player.frameY = 1; // Linha 2 representa o movimento para a direita
    }
   
    // Avançar para o próximo quadro (animação)
    player.frameX = (player.frameX + 1) % 6; // Supondo 4 quadros por linha

    //Ataca para baixo
    if (e.key === ' ' && (player.frameY === 3 || player.frameY === 6)) {
        player.frameY = 6;
        player.frameX = 0;
    }

    //Ataca para direita
    if (e.key === ' ' && (player.frameY === 1 || player.frameY === 7)) {
        player.frameY = 7;
        player.frameX = 0;
    }

     //Ataca para esquerda
     if (e.key === ' ' && (player.frameY === 0 || player.frameY === 9)) {
        player.frameY = 9;
        player.frameX = 0;
    }

    //Ataca para cima
    if (e.key === ' ' && (player.frameY === 5 || player.frameY === 8)) {
        player.frameY = 8;
        player.frameX = 0;
    }

    // Verificar colisões
    if (!isColliding(nextX, nextY)) {
        player.x = nextX;
        player.y = nextY;
    }
});

