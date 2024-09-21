import factory from '@adonisjs/lucid/factories'
import Sound from '#models/sound'

export const SoundFactory = factory
  .define(Sound, async ({ faker }) => {
    return {}
  })
  .build()