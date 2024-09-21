import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class GameSound extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'game_id' })
  declare gameId: number

  @column({ columnName: 'sound_id' })
  declare soundId: number

  @column({ columnName: "round"})
  declare round: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}