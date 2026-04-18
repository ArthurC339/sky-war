namespace SpriteKind {
    export const Player1 = SpriteKind.create()
    export const Player2 = SpriteKind.create()
    export const ProjectileP1 = SpriteKind.create()
    export const ProjectileP2 = SpriteKind.create()
    export const Barrier = SpriteKind.create()
}

// ================= 🏆 ESTADO =================
let scoreP1 = 0
let scoreP2 = 0
let emRound = false
let emCutscene = true

let canShootP1 = true
let canShootP2 = true

// ⚡ ATAQUE RÁPIDO (DISPONÍVEL DESDE O INÍCIO)
let specialP1Ready = true
let specialP2Ready = true

let specialP1Active = false
let specialP2Active = false

// ================= ⏱ SISTEMA DE TEMPO =================
let lastSpecialP1 = 0
let lastSpecialP2 = 0

// ================= 📊 PLACAR =================
let scoreImg = image.create(80, 10)
let scoreSprite = sprites.create(scoreImg, 0)
scoreSprite.setPosition(80, 10)

function updateScore() {
    scoreImg = image.create(80, 10)
    scoreImg.print(scoreP1 + " - " + scoreP2, 25, 2, 1)
    scoreSprite.setImage(scoreImg)
}

// ================= 🌌 ESTRELAS =================
let starCount = 140
let stars: Image[] = []
let starX: number[] = []
let starY: number[] = []

let bg = image.create(160, 120)

function criarEstrelas() {

    stars = []
    starX = []
    starY = []

    for (let i = 0; i < starCount; i++) {

        let size = randint(1, 2)
        let s = image.create(size, size)

        let brilho = randint(1, 3)
        s.setPixel(0, 0, brilho)

        stars.push(s)
        starX.push(randint(0, 159))
        starY.push(randint(0, 119))
    }
}

function desenharEstrelas() {

    bg.fill(0)

    for (let i = 0; i < stars.length; i++) {
        bg.drawImage(stars[i], starX[i], starY[i])
    }

    scene.setBackgroundImage(bg)
}

game.onUpdateInterval(200, function () {

    if (emCutscene) return

    for (let i = 0; i < stars.length; i++) {

        starX[i] += randint(-1, 1)
        starY[i] += randint(-1, 1)

        if (starX[i] < 0) starX[i] = 159
        if (starX[i] > 159) starX[i] = 0

        if (starY[i] < 0) starY[i] = 119
        if (starY[i] > 119) starY[i] = 0
    }

    desenharEstrelas()
})

// ================= 🪐 BARREIRA =================
let barrierImg = image.create(6, 120)
for (let y = 0; y < 120; y++) {
    barrierImg.setPixel(2, y, 7)
    barrierImg.setPixel(3, y, 7)
}

let barrier = sprites.create(barrierImg, SpriteKind.Barrier)
barrier.setPosition(80, 60)

// ================= 🛸 NAVES =================
let p1 = sprites.create(img`
....fffff....
...f7f7f7f...
..f7f7777f7f..
..f777999777f..
..f779999977f..
...f7777777f...
....fffff....
`, SpriteKind.Player1)

let p2 = sprites.create(img`
....22222....
...2444442...
..244555542..
..2455995542..
..2455555542..
...2444442...
....22222....
`, SpriteKind.Player2)

p1.setPosition(30, 80)
p2.setPosition(130, 80)

controller.player1.moveSprite(p1, 0, 110)
controller.player2.moveSprite(p2, 0, 110)

// ================= 🎬 CUTSCENE =================
criarEstrelas()
desenharEstrelas()

controller.player1.moveSprite(p1, 0, 0)
controller.player2.moveSprite(p2, 0, 0)

pause(400)
game.splash("🌌 GUERRA ESPACIAL")
pause(200)

emCutscene = false

controller.player1.moveSprite(p1, 0, 110)
controller.player2.moveSprite(p2, 0, 110)

// ================= 🎮 MOVIMENTO =================
game.onUpdate(function () {

    if (emCutscene) return

    p1.x = 30
    p2.x = 130

    p1.y += Math.sin(game.runtime() / 200) * 0.4
    p2.y += Math.cos(game.runtime() / 200) * 0.4
})

// ================= 🔫 TIRO NORMAL =================
controller.player1.onButtonEvent(ControllerButton.A, ControllerButtonEvent.Released, function () {

    if (emCutscene || emRound || !canShootP1) return

    canShootP1 = false

    let speed = specialP1Active ? 200 : 100

    let shot = sprites.createProjectileFromSprite(img`
. . 2 . .
. 2 5 2 .
. . 1 . .
`, p1, speed, 0)

    shot.setKind(SpriteKind.ProjectileP1)

    pause(500)
    canShootP1 = true
})

controller.player2.onButtonEvent(ControllerButton.A, ControllerButtonEvent.Released, function () {

    if (emCutscene || emRound || !canShootP2) return

    canShootP2 = false

    let speed = specialP2Active ? -200 : -100

    let shot = sprites.createProjectileFromSprite(img`
. . 4 . .
. 4 5 4 .
. . 1 . .
`, p2, speed, 0)

    shot.setKind(SpriteKind.ProjectileP2)

    pause(500)
    canShootP2 = true
})

// ================= ⚡ ATAQUE RÁPIDO (CORRIGIDO E DESDE O INÍCIO) =================
controller.player1.onButtonEvent(ControllerButton.B, ControllerButtonEvent.Pressed, function () {

    if (emCutscene || emRound) return

    let now = game.runtime()

    // cooldown 5s
    if (now - lastSpecialP1 < 10000) return

    lastSpecialP1 = now
    specialP1Active = true

    pause(5000)
    specialP1Active = false
})

controller.player2.onButtonEvent(ControllerButton.B, ControllerButtonEvent.Pressed, function () {

    if (emCutscene || emRound) return

    let now = game.runtime()

    if (now - lastSpecialP2 < 10000) return

    lastSpecialP2 = now
    specialP2Active = true

    pause(5000)
    specialP2Active = false
})

// ================= 💥 COLISÃO =================
sprites.onOverlap(SpriteKind.ProjectileP1, SpriteKind.Player2, function (proj, alvo) {
    proj.destroy()
    p2.startEffect(effects.fire, 100)
    endRound(1)
})

sprites.onOverlap(SpriteKind.ProjectileP2, SpriteKind.Player1, function (proj, alvo) {
    proj.destroy()
    p1.startEffect(effects.fire, 100)
    endRound(2)
})

// ================= 🧹 LIMPAR =================
function clearShots() {
    for (let s of sprites.allOfKind(SpriteKind.ProjectileP1)) s.destroy()
    for (let s of sprites.allOfKind(SpriteKind.ProjectileP2)) s.destroy()
}

// ================= 🏆 ROUND =================
function endRound(winner: number) {

    emRound = true
    clearShots()

    if (winner == 1) scoreP1++
    else scoreP2++

    updateScore()

    pause(600)

    p1.setPosition(30, 80)
    p2.setPosition(130, 80)

    if (scoreP1 >= 3) game.over(true)
    if (scoreP2 >= 3) game.over(false)

    emRound = false
}