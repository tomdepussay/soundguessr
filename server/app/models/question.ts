import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Question extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'question' })
  declare question: string

  @column({ columnName: 'target' })
  declare target: string

  @column({ columnName: 'order' })
  declare order: number

  @column({ columnName: 'is_active' })
  declare isActive: boolean

  @column({ columnName: "type_id" })
  declare typeId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}