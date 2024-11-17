import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import Right from './right.js'
import * as relations from '@adonisjs/lucid/types/relations'

export default class Profile extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'name' })
  declare name: string

  @column({ columnName: 'description' })
  declare description: string | null

  @manyToMany(() => Right, {
    pivotTable: 'profiles_rights'
  })
  public rights!: relations.ManyToMany<typeof Right>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}