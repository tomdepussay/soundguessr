import factory from '@adonisjs/lucid/factories'
import NetworkUser from '#models/network_user'

export const NetworkUserFactory = factory
  .define(NetworkUser, async ({ faker }) => {
    return {}
  })
  .build()