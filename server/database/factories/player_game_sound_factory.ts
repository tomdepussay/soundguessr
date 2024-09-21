import factory from '@adonisjs/lucid/factories'
import PlayerGameSound from '#models/player_game_sound'

export const PlayerGameSoundFactory = factory
  .define(PlayerGameSound, async ({ faker }) => {
    return {}
  })
  .build()