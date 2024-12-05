const npcs = [];
const npcCount = 3;
const npcImage = new Image();
npcImage.src = '../img/morador.png'; // Substitua pelo caminho correto da imagem dos NPCs

// Função para criar um novo NPC
function createNPC(x, y, dialog) {
    return {
        x: x,
        y: y,
        width: 14,
        height: 18,
        frameX: 0,
        frameY: 0,
        frameWidth: 17,  // Largura de cada quadro na imagem de sprites
        frameHeight: 18,
        image: npcImage,
        dialog: dialog,
        draw(ctx) {
            ctx.drawImage(
                this.image,
                this.frameX * this.frameWidth,
                this.frameY * this.frameHeight,
                this.frameWidth,
                this.frameHeight,
                this.x,
                this.y,
                12,
                12
            );
        },
        interact(player) {
            if (Math.abs(this.x - player.x) < this.width && Math.abs(this.y - player.y) < this.height) {
                return this.dialog;
            }
            return null;
        }
    };
}

// Inicializar NPCs com posições e diálogos
npcs.push(createNPC(600, 110, "Eles levaram tudo... mas você pode lutar por nós, não é? Você é nossa última esperança!"));
npcs.push(createNPC(530, 365, "Os orcs não só destruíram nossas casas, mas tentam roubar nossa coragem. Mostre que estamos errados!"));
npcs.push(createNPC(100, 420, "Perdemos nossas casas, mas não nossa vontade de viver. Com sua ajuda, ninja, vamos reconstruir e seguir em frente."));

// Função para desenhar NPCs
function drawNPCs(ctx) {
    npcs.forEach(npc => {
        npc.draw(ctx);
    });
}

// Função para verificar interação com NPCs
function checkNPCInteraction(player) {
    for (let npc of npcs) {
        const dialog = npc.interact(player);
        if (dialog) {
            displayDialog(dialog);
            break;
        }
    }
}

// Função para exibir o diálogo na parte inferior da tela
function displayDialog(dialog) {
    const dialogBox = document.getElementById('dialogBox');
    dialogBox.innerText = dialog;
    dialogBox.style.color = 'white';
    setTimeout(() => {
        dialogBox.style.color = 'black';
    }, 8000); // Exibir o diálogo por 3 segundos
}

// Adicione a chamada para drawNPCs na função principal de desenho do jogo
function drawAllNPC(ctx) {
    drawNPCs(ctx);
}

// Adicionar evento para interação com NPCs
window.addEventListener('keydown', (e) => {
    if (e.key === 'q' || e.key === 'Q') {
        checkNPCInteraction(player);
    }
});

