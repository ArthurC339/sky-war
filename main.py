@namespace
class SpriteKind:
    ProjectileP1 = SpriteKind.create()
player1 = sprites.create(img("""
        . . . 9 9 9 . . .
        . . 9 9 9 9 9 . .
        . 9 9 9 9 9 9 9 .
        """),
    SpriteKind.player)
controller.player1.move_sprite(player1)
player2 = sprites.create(img("""
        . . . 9 . . . . .
        . . 9 9 9 . . . .
        . 9 9 9 9 9 . . .
        """),
    SpriteKind.player)
controller.player2.move_sprite(player2)
def aplicarDano(alvo: Sprite):
    # exemplo simples: usa info.changeLife se preferir
    info.change_life_by(-1)

def on_player1_button_a_released():
    p = sprites.create_projectile_from_sprite(img("""
            . . 2 . .
            . 2 5 2 .
            . . 1 . .
            """),
        player1,
        0,
        50)
    p.set_kind(SpriteKind.ProjectileP1)
    p.lifespan = 2000
controller.player1.on_button_event(ControllerButton.A,
    ControllerButtonEvent.RELEASED,
    on_player1_button_a_released)

def on_on_overlap(proj, alvo2):
    if alvo2 == player2:
        proj.destroy(effects.fire, 100)
        aplicarDano(alvo2)
sprites.on_overlap(SpriteKind.ProjectileP1, SpriteKind.player, on_on_overlap)
