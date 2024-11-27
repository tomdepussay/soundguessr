import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'sounds'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('title').notNullable()
      table.string('url').notNullable()
      table.string('path').notNullable()
      table.integer('order').notNullable()
      table.integer("before").notNullable().defaultTo(0)
      table.integer("after").notNullable().defaultTo(0)
      table.boolean('is_active').defaultTo(true)
      table.integer('license_id').unsigned().references('licenses.id').onDelete('CASCADE')
      table.integer('type_id').unsigned().references('types.id').onDelete('CASCADE')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}