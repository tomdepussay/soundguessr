import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('profile_id').unsigned().references('id').inTable('profiles').onDelete('CASCADE').defaultTo(4)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign(['profile_id'])
      table.dropColumn('profile_id')
    })
  }
}