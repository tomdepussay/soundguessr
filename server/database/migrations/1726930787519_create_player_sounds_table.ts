import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'player_sounds'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('player_id').unsigned().references('players.id').onDelete('CASCADE')
      table.integer('game_sound_id').unsigned().references('game_sounds.id').onDelete('CASCADE')
      table.integer('score').notNullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}