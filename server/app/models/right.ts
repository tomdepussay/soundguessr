import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import Profile from './profile.js'
import * as relations from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class Right extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'name' })
  declare name: string

  @column({ columnName: 'code' })
  declare code: string

  @manyToMany(() => Profile, {
    pivotTable: 'profiles_rights'
  })
  public profiles!: relations.ManyToMany<typeof Profile>

  @manyToMany(() => User, {
    pivotTable: 'users_rights'
  })
  public users!: relations.ManyToMany<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}