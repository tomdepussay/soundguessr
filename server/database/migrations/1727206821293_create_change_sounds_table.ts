import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'sounds'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer("before").notNullable().defaultTo(0).alter(),
      table.integer("after").notNullable().defaultTo(0).alter()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}