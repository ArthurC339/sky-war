namespace SpriteKind {
    export const Player1 = SpriteKind.create()
    export const Player2 = SpriteKind.create()
    export const ProjectileP1 = SpriteKind.create()
    export const ProjectileP2 = SpriteKind.create()
}

// ================= 🌌 GALÁXIA =================
let starLayer = image.create(160, 120)

for (let i = 0; i < 90; i++) {
    starLayer.setPixel(randint(0, 159), randint(0, 119), randint(1, 2))
}

scene.setBackgroundImage(starLayer)

game.onUpdateInterval(250, function () {
    starLayer.setPixel(randint(0, 159), randint(0, 119), randint(0, 2))
})

// ================= ⚙️ ESTADO =================
let emCutscene = true

// ================= 🛸 SPRITES =================
let player1 = sprites.create(img`
. . . . . . . . . . . . . . . .
. . . . . . . 9 9 9 . . . . . .
. . . . . . 9 9 9 9 9 . . . . .
. . . . . 9 9 9 9 9 9 9 . . . .
. . . . . 6 6 9 9 9 6 6 . . . .
. . . 6 6 6 1 6 1 6 6 6 . . . .
. . . 6 6 6 1 1 1 6 6 6 . . . .
. . . . . 6 6 1 6 1 6 6 . . . .
. . . . . . f . . . f . . . . .
. . . . . . 2 . . . 2 . . . . .
. . . . . 4 . . 4 . . 4 . . . .
. . . . . . . 4 . 4 . . . . . .
. . . . . 4 . 4 . 4 . . . . . .
`, SpriteKind.Player1)

let player2 = sprites.create(img`
. . . . . . . . . . . . . . . .
. . . . . . . 9 . . . . . . . .
. . . . . . 9 9 9 . . . . . . .
. . . . . 9 9 9 9 9 . . . . . .
. . . 6 4 8 4 8 4 6 . . . . . .
. . . 8 8 8 8 8 8 8 8 8 . . . .
. . . 8 6 8 8 8 8 8 6 8 . . . .
. . . . 8 8 8 8 8 8 8 . . . . .
. . . . . f . . . f . . . . . .
. . . . . 2 . . . 2 . . . . . .
. . . . 4 . 4 4 . . 4 . . . . .
. . . . . 4 . . 4 . . . . . .
. . . . . . . . . 4 . . . . . .
`, SpriteKind.Player2)

// ================= VIDA =================
info.player1.setLife(3)
info.player2.setLife(3)

// ================= POSIÇÃO =================
function resetPosicao() {
    player1.setPosition(30, 80)
    player2.setPosition(130, 80)
}

resetPosicao()

// ================= CONTROLES =================
controller.player1.moveSprite(player1, 100, 100)
controller.player2.moveSprite(player2, 100, 100)

// ================= 🎬 CUTSCENE =================
function cutscene() {

    emCutscene = true

    controller.player1.moveSprite(player1, 0, 0)
    controller.player2.moveSprite(player2, 0, 0)

    game.splash("🌌 GUERRA GALÁCTICA")

    for (let i = 0; i < 6; i++) {

        sprites.createProjectileFromSprite(img`
            . . 2 . .
            . 2 5 2 .
            . . 1 . .
        `, player1, 60, randint(-20, 20))

        sprites.createProjectileFromSprite(img`
            . . 4 . .
            . 4 4 4 .
            . . 1 . .
        `, player2, -60, randint(-20, 20))

        pause(300)
    }

    player1.startEffect(effects.fire, 500)
    player2.startEffect(effects.fire, 500)

    pause(800)

    emCutscene = false

    controller.player1.moveSprite(player1, 100, 100)
    controller.player2.moveSprite(player2, 100, 100)
}

// ================= 🔁 RESET RODADA =================
function resetRodada() {
    resetPosicao()
    cutscene()
}

// ================= 🏆 VITÓRIA =================
function checarVitoria() {

    if (info.player1.life() <= 0) {
        game.splash("🏆 PLAYER 2 VENCEU!")
        game.over(true, effects.confetti)
    }

    if (info.player2.life() <= 0) {
        game.splash("🏆 PLAYER 1 VENCEU!")
        game.over(true, effects.confetti)
    }
}

// ================= 💥 DANO =================
function aplicarDano(alvo: Sprite) {

    if (alvo == player1) {
        info.player1.changeLifeBy(-1)
        music.playTone(262, music.beat(BeatFraction.Quarter))

        resetRodada()
        checarVitoria()

    } else if (alvo == player2) {
        info.player2.changeLifeBy(-1)
        music.playTone(392, music.beat(BeatFraction.Quarter))

        resetRodada()
        checarVitoria()
    }
}

// ================= 💥 COLISÃO =================
sprites.onOverlap(SpriteKind.ProjectileP1, SpriteKind.Player2, function (proj, alvo) {
    proj.destroy()
    aplicarDano(alvo)
})

sprites.onOverlap(SpriteKind.ProjectileP2, SpriteKind.Player1, function (proj, alvo) {
    proj.destroy()
    aplicarDano(alvo)
})

// ================= 🔫 TIROS =================
controller.player1.onButtonEvent(ControllerButton.A, ControllerButtonEvent.Released, function () {
    if (!emCutscene) {
        sprites.createProjectileFromSprite(img`
            . . . . . 2 . . .
            . . . 2 5 2 . . .
            . . . . 1 . . . .
        `, player1, 0, 80).setKind(SpriteKind.ProjectileP1)
    }
})

controller.player2.onButtonEvent(ControllerButton.B, ControllerButtonEvent.Released, function () {
    if (!emCutscene) {
        sprites.createProjectileFromSprite(img`
            . . . . . 4 . . .
            . . . 4 4 4 . . .
            . . . . 1 . . . .
        `, player2, 0, 80).setKind(SpriteKind.ProjectileP2)
    }
})

// ================= START =================
cutscene()