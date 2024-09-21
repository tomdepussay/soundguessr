import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class NetworkUser extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'network_id' })
  declare networkId: number

  @column({ columnName: 'user_id' })
  declare userId: number

  @column({ columnName: 'name' })
  declare name: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}