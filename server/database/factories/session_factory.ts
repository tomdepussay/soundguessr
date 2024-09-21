import factory from '@adonisjs/lucid/factories'
import Session from '#models/session'

export const SessionFactory = factory
  .define(Session, async ({ faker }) => {
    return {}
  })
  .build()