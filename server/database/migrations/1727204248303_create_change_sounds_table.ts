import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'sounds'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer("before").notNullable().checkPositive().defaultTo(0),
      table.integer("after").notNullable().checkPositive().defaultTo(0)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}