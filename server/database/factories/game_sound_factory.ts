import factory from '@adonisjs/lucid/factories'
import GameSound from '#models/game_sound'

export const GameSoundFactory = factory
  .define(GameSound, async ({ faker }) => {
    return {}
  })
  .build()