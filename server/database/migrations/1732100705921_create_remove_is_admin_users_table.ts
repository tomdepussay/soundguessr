import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('is_admin')
    })
  }

  async down() {
    // Si vous avez besoin de restaurer la colonne dans le rollback, vous pouvez la recréer ici
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('is_admin').defaultTo(false) // Assurez-vous que le type correspond à ce qu'il était avant
    })
  }
}