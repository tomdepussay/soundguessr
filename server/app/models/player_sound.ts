import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class PlayerSound extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: "player_id"})
  declare playerId: number

  @column({ columnName: "game_sound_id"})
  declare gameSoundId: number

  @column({ columnName: "score"})
  declare score: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}