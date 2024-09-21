import factory from '@adonisjs/lucid/factories'
import Network from '#models/network'

export const NetworkFactory = factory
  .define(Network, async ({ faker }) => {
    return {}
  })
  .build()