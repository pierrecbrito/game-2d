// enemies.js

const enemies = [];
const enemyCount = 3;
const enemySpeed = 2;
const enemyImage = new Image();
enemyImage.src = '../img/orc_walk.png';
const enemyImageAttack = new Image();
enemyImageAttack.src = '../img/orc_attack.png';
const enemyImageDead = new Image();
enemyImageDead.src = '../img/orc_death.png';

// Função para criar um novo inimigo
function createEnemy(x, y) {
    return {
        x: x,
        y: y,
        width: 22,
        height: 22,
        frameWidth: 64,  // Largura de cada quadro na imagem de sprites
        frameHeight: 64,
        frameX: 0,
        frameY: 0,
        speed: enemySpeed,
        image: enemyImage,
        life: 3,
        direction: Math.floor(Math.random() * 4),
        isAlive: true,
        moveRandomly() {
            const distanceToPlayer = Math.hypot(player.x - this.x, player.y - this.y);

            if(distanceToPlayer < 10) {//Se o jogador estiver muito perto, o orc ataca
                this.image = enemyImageAttack;

                if (player.x > this.x) {
                    this.frameY = 3; // Ataque para a direita
                } else if (player.x < this.x) {
                    this.frameY = 2; // Ataque para a esquerda
                }
                if (player.y > this.y) {
                    this.frameY = 0; // Ataque para baixo
                } else if (player.y < this.y) {
                    this.frameY = 1; // Ataque para cima
                }
                this.attack(player);
            } else  if (distanceToPlayer < 70) { // Se o jogador estiver perto, persegue-o
                this.image = enemyImage;
                if (player.x > this.x && !isEnemyColliding(this.x + this.speed, this.y)) {
                    this.x += this.speed;
                    this.frameY = 3; // Ataque para a direita
                } else if (player.x < this.x && !isEnemyColliding(this.x - this.speed, this.y)) {
                    this.x -= this.speed;
                    this.frameY = 2; // Ataque para a esquerda
                }
                if (player.y > this.y && !isEnemyColliding(this.x, this.y + this.speed)) {
                    this.y += this.speed;
                    this.frameY = 0; // Ataque para baixo
                } else if (player.y < this.y && !isEnemyColliding(this.x, this.y - this.speed)) {
                    this.y -= this.speed;
                    this.frameY = 1; // Ataque para cima
                }
            } else { // Caso contrário, move-se aleatoriamente
                this.image = enemyImage;
                let nextX = this.x;
                let nextY = this.y;

                switch (this.direction) {
                    case 0: // Up
                        nextY -= this.speed;
                        this.frameY = 1; // Linha 5 representa o ataque para cima
                        break;
                    case 1: // Down
                        nextY += this.speed;
                        this.frameY = 0; // Linha 4 representa o ataque para baixo
                        break;
                    case 2: // Left
                        nextX -= this.speed;
                        this.frameY = 2; // Linha 2 representa o movimento para a esquerda
                        break;
                    case 3: // Right
                        nextX += this.speed;
                        this.frameY = 3; // Linha 3 representa o ataque para a direita
                        break;
                }

                // Verificar colisões
                if (!isEnemyColliding(nextX, nextY)) {
                    this.x = nextX;
                    this.y = nextY;
                } else {
                    this.direction = Math.floor(Math.random() * 4);
                }
            }

            this.frameX = (this.frameX + 1) % 6; // Supondo 6 quadros por linha
        },
        attack(player) {
            if (Math.abs(this.x - player.x) < this.width && Math.abs(this.y - player.y) < this.height && this.frameX === 5) {
                player.life -= 1;
            }

            orcSwordCutMusic.play();
        },
        kill() {
            this.isAlive = false;
            this.frameX = 5;
            this.frameY = 0;
            this.image = enemyImageDead;
        },
        draw(ctx) {
            ctx.drawImage(
                this.image,
                this.frameX * this.frameWidth,
                this.frameY * this.frameHeight,
                this.frameWidth,
                this.frameHeight,
                this.x,
                this.y,
                28,
                28
            );
        }
    };
}

// Inicializar inimig
enemies.push(createEnemy(480, 120));
enemies.push(createEnemy(500, 380));
enemies.push(createEnemy(120, 400));


// Função para atualizar e desenhar inimigos
function updateEnemies(ctx, player) {
    enemies.forEach(enemy => {
        enemy.draw(ctx);
    });
}

setInterval(() => {
    enemies.forEach(enemy => {
        if(enemy.isAlive && gameOn)
            enemy.moveRandomly();
    });
}, 200);

// Adicione a chamada para updateEnemies na função principal de desenho do jogo
function drawEnemies(ctx) {
    updateEnemies(ctx, player);
}

function isEnemyColliding(x, y) {
    const tileX2 = Math.floor((x + 8) / tileWidth);
    const tileY2 = Math.floor((y + 20) / tileHeight);
    const tileX1 = Math.floor((x + 18) / tileWidth);

    if (tileX2 >= mapData.width || tileY2 >= mapData.height) {
        return true; // Fora dos limites do mapa
    }

    // Verificar colisão com a camada de tiles
    return collisionGrid[tileY2][tileX2] !== 0 || collisionGrid[tileY2][tileX1] !== 0;
}