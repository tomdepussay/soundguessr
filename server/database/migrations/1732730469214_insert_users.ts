import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    await this.db.table(this.tableName).insert([
      { id: 1, username: "Admin", email: "admin@gmail.com", password: "$scrypt$n=16384,r=8,p=1$21Zoh1z9FLQtMyXDqms1aw$bWbRT9CgncSRmxQovaL4Hoglf+R/s8AK0PlTfDejnb5jpXRxZRYziurzk61KHwrTehsRA9IgV1LG0A+B8U0UYQ", is_active: 1, role_id: 1, created_at: new Date(), updated_at: new Date() },
      { id: 2, username: "Tom", email: "tom@gmail.com", password: "$scrypt$n=16384,r=8,p=1$LcAWdUTFAoSiLmvPaL2BcA$koIRtO+a/WUC5U92WgdP9aE+knPskV2G8gJKr6kzVts2c7JoYba+TF4vrdg3ZARUKR6VF5NOzcdqiVMcAF7pvQ", is_active: 1, role_id: 3, created_at: new Date(), updated_at: new Date() },
    ])
  }

  async down() {
  }
}