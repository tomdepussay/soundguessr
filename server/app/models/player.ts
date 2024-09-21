import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Player extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: "user_id"})
  declare userId: number

  @column({ columnName: "game_id"})
  declare gameId: number

  @column({ columnName: "is_owner"})
  declare isOwner: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}