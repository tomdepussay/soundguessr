import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'profiles_rights'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('profile_id').unsigned().references('id').inTable('profiles').onDelete('CASCADE')
      table.integer('right_id').unsigned().references('id').inTable('rights').onDelete('CASCADE')
      table.unique(['profile_id', 'right_id'])
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}