import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'roles'

  async up() {
    await this.db.table(this.tableName).insert([
      { id: 1, name: "Administrateur", created_at: new Date(), updated_at: new Date() },
      { id: 2, name: "Modérateur", created_at: new Date(), updated_at: new Date() },
      { id: 3, name: "Observateur", created_at: new Date(), updated_at: new Date() },
      { id: 4, name: "Utilisateur", created_at: new Date(), updated_at: new Date() }
    ])
  }

  async down() {
  }
}