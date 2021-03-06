import Phaser from 'phaser'

import Touch from '../helpers/Touch'
import Face from '../sprites/Face'
import Stars from '../sprites/Stars'

const sounds = {
  1: "bell1",
  2: "bell2",
  3: "bell3",
  4: "bell4",
  5: "bell5"
}

export default class extends Phaser.State {
  init (score) {
    this.score = score
  }

  create () {
    let background = this.game.add.graphics(0, 0)
    background.beginFill(0xE09E91, 1)
    background.drawRect(0, 0, this.game.width, this.game.height)
    background.endFill()

    let banner = this.add.text(this.game.world.centerX, this.game.world.centerY - 20, 'Rated')
    banner.font = 'Lato'
    banner.fontSize = 70
    banner.fontWeight = 100
    banner.fill = '#553965'
    banner.anchor.setTo(0.5, 0)

    banner = this.add.text(this.game.world.centerX, this.game.world.centerY + 60, this.score + ' Stars')
    banner.font = 'Lato'
    banner.fontSize = 70
    banner.fontWeight = 100
    banner.fontStyle = 'italic'
    banner.fill = '#000'
    banner.anchor.setTo(0.5, 0)

    this.face = new Face({
      game: this.game,
      x: this.game.world.centerX,
      y: 0.55 * this.game.world.centerY
    })
    this.tween = this.game.add.tween(this.face.scale).to({ x: 2.1, y: 2.1 }, 100, Phaser.Easing.Bounce.InOut, false, 0, 0, true)

    this.stars = new Stars({
      game: this.game,
      x: this.game.world.centerX,
      y: 1.7 * this.game.world.centerY
    })

    this.overlay = this.game.add.graphics(0, 0)
    this.overlay.beginFill(0, 1)
    this.overlay.drawRect(0, 0, this.game.width, this.game.height)
    this.overlay.endFill()

    this.sound = this.game.add.audio(sounds[this.score])
    this.game.sound.setDecodedCallback([ this.sound ], this.fade, this)

    this.touch = new Touch(game)
  }

  fade () {
    let fade = this.game.add.tween(this.overlay)
    fade.to({ alpha: 0 }, 400, null)
    fade.onComplete.add(this.surprise, this)
    this.game.time.events.add(400, fade.start, fade)

  }

  surprise () {
    this.game.add.existing(this.face)
    this.game.add.existing(this.stars)
    this.face.setScore(this.score)
    this.stars.setScore(this.score)
    this.sound.play()
    this.tween.start()
  }

  update () {
    this.touch.update()
    if (this.touch.isTapped()) {
      if (this.touch.within(this.face.getBounds())) {
        this.sound.play()
        this.tween.start()
      } else {
        this.game.stateTransition.configure({
          duration: Phaser.Timer.SECOND * 0.3,
          ease: Phaser.Easing.Linear.None,
            properties: {
              alpha: 0
            }
        })
        this.game.stateTransition.to('Rate', true, false)
      }
    }
  }
}
