import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import Right from './right.js'
import * as relations from '@adonisjs/lucid/types/relations'
import db from '@adonisjs/lucid/services/db'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'username' })
  declare username: string

  @column({ columnName: 'email' })
  declare email: string

  @column({ serializeAs: null, columnName: 'password' })
  declare password: string

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

  public static async hasPermission(permission: string, profileId: number){
    let hasRight = false;
    
    // Vérification si la permission est présente pour le profil de l'utilisateur
    const profileHasPermission = await db
        .query()
        .from("profiles_rights")
        .leftJoin("rights", "rights.id", "profiles_rights.right_id")
        .select("*")
        .where("rights.code", permission)
        .where("profiles_rights.profile_id", profileId)
    
    if(profileHasPermission.length === 0){
        hasRight = true;
    }
  }
}