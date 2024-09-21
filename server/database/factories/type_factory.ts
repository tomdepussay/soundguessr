import factory from '@adonisjs/lucid/factories'
import Type from '#models/type'

export const TypeFactory = factory
  .define(Type, async ({ faker }) => {
    return {}
  })
  .build()