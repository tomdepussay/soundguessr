import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'profiles'

  async up() {
    await this.db.table(this.tableName).insert([
      { name: "Administrateur", created_at: new Date(), updated_at: new Date() },
      { name: "Modérateur", created_at: new Date(), updated_at: new Date() },
      { name: "Observateur", created_at: new Date(), updated_at: new Date() },
      { name: "Utilisateur", created_at: new Date(), updated_at: new Date() }
    ])
  }

  async down() {
  }
}