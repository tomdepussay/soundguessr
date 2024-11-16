import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import Right from './right.js'
import * as relations from '@adonisjs/lucid/types/relations'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'username' })
  declare username: string

  @column({ columnName: 'email' })
  declare email: string

  @column({ serializeAs: null, columnName: 'password' })
  declare password: string

  @column({ columnName: 'is_admin' })
  declare isAdmin: boolean

  @column({ columnName: 'picture' })
  declare picture: string

  @column({ columnName: 'bio' })
  declare bio: string

  @column({ columnName: 'is_active' })
  declare isActive: boolean

  @column({ columnName: 'profile_id'})
  declare profileId: number

  @manyToMany(() => Right, {
    pivotTable: 'users_rights'
  })
  public rights!: relations.ManyToMany<typeof Right>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  public static async hashPassword(password: string): Promise<string> {
    return hash.make(password)
  }

  public static async verifyPassword(user: User, password: string): Promise<boolean> {
    return await hash.verify(user.password, password)
  }

  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '30 days',
    prefix: 'oat_',
    table: 'auth_access_tokens',
    type: 'auth_token',
    tokenSecretLength: 40,
  })
}