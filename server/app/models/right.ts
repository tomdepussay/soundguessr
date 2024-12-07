import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import Role from './role.js'
import * as relations from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class Right extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'name' })
  declare name: string

  @column({ columnName: 'code' })
  declare code: string

  @column({ columnName: "parent_id" })
  declare parentId: number | null

  @manyToMany(() => Role, {
    pivotTable: 'roles_rights'
  })
  public roles!: relations.ManyToMany<typeof Role>

  @manyToMany(() => User, {
    pivotTable: 'users_rights'
  })
  public users!: relations.ManyToMany<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}