import factory from '@adonisjs/lucid/factories'
import Player from '#models/player'

export const PlayerFactory = factory
  .define(Player, async ({ faker }) => {
    return {}
  })
  .build()