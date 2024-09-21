import factory from '@adonisjs/lucid/factories'
import Question from '#models/question'

export const QuestionFactory = factory
  .define(Question, async ({ faker }) => {
    return {}
  })
  .build()