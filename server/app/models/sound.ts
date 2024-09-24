import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Sound extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'title' })
  declare title: string

  @column({ columnName: 'url' })
  declare url: string

  @column({ columnName: "before" })
  declare before: number

  @column({ columnName: "after" })
  declare after: number

  @column({ columnName: "path"})
  declare path: string

  @column()
  declare audio: string

  @column({ columnName: 'order' })
  declare order: number

  @column({ columnName: 'is_active' })
  declare isActive: boolean

  @column({ columnName: 'license_id' })
  declare licenseId: number

  @column({ columnName: 'type_id' })
  declare typeId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}