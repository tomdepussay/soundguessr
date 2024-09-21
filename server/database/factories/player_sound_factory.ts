import factory from '@adonisjs/lucid/factories'
import PlayerSound from '#models/player_sound'

export const PlayerSoundFactory = factory
  .define(PlayerSound, async ({ faker }) => {
    return {}
  })
  .build()