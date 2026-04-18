namespace SpriteKind {
    export const Player1 = SpriteKind.create()
    export const Player2 = SpriteKind.create()
    export const ProjectileP1 = SpriteKind.create()
    export const ProjectileP2 = SpriteKind.create()
    export const Barreira = SpriteKind.create()
}

// ================= 🌌 GALÁXIA =================
let starLayer = image.create(160, 120)

function gerarEstrelas() {
    for (let i = 0; i < 60; i++) {
        starLayer.setPixel(randint(0, 159), randint(0, 119), randint(1, 2))
    }
}
gerarEstrelas()

scene.setBackgroundImage(starLayer)

// animação leve
game.onUpdateInterval(150, function () {
    for (let y = 119; y > 0; y--) {
        for (let x = 0; x < 160; x++) {
            starLayer.setPixel(x, y, starLayer.getPixel(x, y - 1))
        }
    }

    for (let x = 0; x < 160; x++) {
        if (randint(0, 50) == 0) {
            starLayer.setPixel(x, 0, randint(1, 2))
        } else {
            starLayer.setPixel(x, 0, 0)
        }
    }
})

// ================= 🏆 ROUNDS =================
let roundsP1 = 0
let roundsP2 = 0
let emCutscene = true

// ================= 🛸 NAVES =================
let player1 = sprites.create(img`
. . . . . . . 6 6 6 . . . . . .
. . . . . 6 7 7 7 7 6 . . . . .
. . . . 6 7 8 8 8 8 7 6 . . . .
. . . 6 7 8 9 9 9 9 8 7 6 . . .
. . . . 6 7 8 9 5 9 8 7 6 . . .
. . . . . 6 7 8 9 8 7 6 . . . .
. . . . . . 6 7 7 7 6 . . . . .
. . . . . . . 6 6 6 . . . . . .
`, SpriteKind.Player1)

let player2 = sprites.create(img`
. . . . . . . 2 2 2 . . . . . .
. . . . . . 2 4 4 4 2 . . . . .
. . . . . 2 4 5 5 5 4 2 . . . .
. . . . 2 4 5 8 8 8 5 4 2 . . .
. . . . . 2 4 5 9 5 4 2 . . . .
. . . . . . 2 4 4 4 2 . . . . .
. . . . . . . 2 2 2 . . . . . .
`, SpriteKind.Player2)

// ================= ✨ EFEITOS =================
player1.startEffect(effects.halo, 80)
player1.startEffect(effects.coolRadial, 120)

player2.startEffect(effects.fire, 50)
player2.startEffect(effects.disintegrate, 150)

// ================= 🧱 BARREIRA =================
let barreiraImg = image.create(4, 120)
barreiraImg.fill(1)

let barreira = sprites.create(barreiraImg, SpriteKind.Barreira)
barreira.setPosition(80, 60)

// ================= 🎮 MOVIMENTO VERTICAL =================
controller.player1.moveSprite(player1, 0, 100)
controller.player2.moveSprite(player2, 0, 100)

// trava eixo X
game.onUpdate(function () {
    player1.x = 30
    player2.x = 130

    if (player1.y < 10) player1.y = 10
    if (player1.y > 110) player1.y = 110

    if (player2.y < 10) player2.y = 10
    if (player2.y > 110) player2.y = 110
})

// ================= 🏁 RESET =================
function resetPosicao() {
    player1.setPosition(30, 80)
    player2.setPosition(130, 80)
}

// ================= 🎬 CUTSCENE HISTÓRIA =================
function cutsceneInicio() {

    emCutscene = true

    controller.player1.moveSprite(player1, 0, 0)
    controller.player2.moveSprite(player2, 0, 0)

    player1.setPosition(20, 60)
    player2.setPosition(140, 60)

    game.splash("🌌 ANO 3042...")
    pause(1000)

    game.splash("A HUMANIDADE CRIOU NAVES DE COMBATE INTELIGENTES")
    pause(1200)

    game.splash("DUAS IA FORAM ATIVADAS SIMULTANEAMENTE")
    pause(1200)

    game.splash("🤖 PROJETO: ECLIPSE VS NOVA")
    pause(1000)

    game.splash("MAS ALGO DEU ERRADO...")
    pause(800)

    // mini animação
    for (let i = 0; i < 6; i++) {
        player1.vx = 20
        player2.vx = -20
        pause(200)
        player1.vx = 0
        player2.vx = 0
        pause(150)
    }

    game.splash("⚠️ HOSTILIDADE DETECTADA")
    pause(1000)

    game.splash("🔥 INICIANDO GUERRA GALÁCTICA")
    pause(800)

    player1.startEffect(effects.halo, 500)
    player2.startEffect(effects.fire, 500)

    pause(600)

    emCutscene = false

    controller.player1.moveSprite(player1, 0, 100)
    controller.player2.moveSprite(player2, 0, 100)
}

// ================= 🏆 FINAL DO ROUND =================
function fimDoRound(vencedor: number) {

    emCutscene = true

    controller.player1.moveSprite(player1, 0, 0)
    controller.player2.moveSprite(player2, 0, 0)

    if (vencedor == 1) {
        roundsP1 += 1
        game.splash("🏆 PLAYER 1 venceu o round!")
    } else {
        roundsP2 += 1
        game.splash("🏆 PLAYER 2 venceu o round!")
    }

    music.baDing.play()

    resetPosicao()
    pause(1200)

    checarCampeao()

    emCutscene = false

    controller.player1.moveSprite(player1, 0, 100)
    controller.player2.moveSprite(player2, 0, 100)
}

// ================= 🏆 CAMPEÃO =================
function checarCampeao() {

    if (roundsP1 >= 3) {
        game.splash("🏆 PLAYER 1 VENCEU A GUERRA!")
        game.over(true, effects.confetti)
    }

    if (roundsP2 >= 3) {
        game.splash("🏆 PLAYER 2 VENCEU A GUERRA!")
        game.over(true, effects.smiles)
    }
}

// ================= COLISÃO =================
sprites.onOverlap(SpriteKind.ProjectileP1, SpriteKind.Player2, function (proj, alvo) {
    proj.destroy()
    player2.startEffect(effects.fire, 100)
    fimDoRound(1)
})

sprites.onOverlap(SpriteKind.ProjectileP2, SpriteKind.Player1, function (proj, alvo) {
    proj.destroy()
    player1.startEffect(effects.halo, 100)
    fimDoRound(2)
})

// ================= TIROS =================
controller.player1.onButtonEvent(ControllerButton.A, ControllerButtonEvent.Released, function () {
    if (!emCutscene) {
        let tiro = sprites.createProjectileFromSprite(img`
. . . . . 2 . . .
. . . 2 5 2 . . .
. . . . 1 . . . .
`, player1, 80, 0)

        tiro.setKind(SpriteKind.ProjectileP1)
        tiro.x = player1.right
    }
})

controller.player2.onButtonEvent(ControllerButton.B, ControllerButtonEvent.Released, function () {
    if (!emCutscene) {
        let tiro = sprites.createProjectileFromSprite(img`
. . . . . 4 . . .
. . . 4 4 4 . . .
. . . . 1 . . . .
`, player2, -80, 0)

        tiro.setKind(SpriteKind.ProjectileP2)
        tiro.x = player2.left
    }
})

// ================= START =================
cutsceneInicio()
resetPosicao()