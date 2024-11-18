import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'rights'

  async up() {
    await this.db.table(this.tableName).insert([
      { name: "Accès administrateur", code: "admin", created_at: new Date(), updated_at: new Date() },
      { name: "Gestion des données", code: "admin.data", created_at: new Date(), updated_at: new Date() },
      { name: "Gestion des utilisateurs", code: "admin.users", created_at: new Date(), updated_at: new Date() },
      { name: "Gestion des parties", code: "admin.games", created_at: new Date(), updated_at: new Date() },
      { name: "Catégories", code: "admin.data.categories", created_at: new Date(), updated_at: new Date() },
      { name: "Ajouter une catégorie", code: "admin.data.categories.add", created_at: new Date(), updated_at: new Date() },
      { name: "Modifier une catégorie", code: "admin.data.categories.edit", created_at: new Date(), updated_at: new Date() },
      { name: "Supprimer une catégorie", code: "admin.data.categories.delete", created_at: new Date(), updated_at: new Date() },
      { name: "Activer/Désactiver une catégorie", code: "admin.data.categories.active", created_at: new Date(), updated_at: new Date() },
      { name: "Licences", code: "admin.data.licenses", created_at: new Date(), updated_at: new Date() },
      { name: "Ajouter une licence", code: "admin.data.licenses.add", created_at: new Date(), updated_at: new Date() },
      { name: "Modifier une licence", code: "admin.data.licenses.edit", created_at: new Date(), updated_at: new Date() },
      { name: "Supprimer une licence", code: "admin.data.licenses.delete", created_at: new Date(), updated_at: new Date() },
      { name: "Activer/Désactiver une licence", code: "admin.data.licenses.active", created_at: new Date(), updated_at: new Date() },
      { name: "Sons", code: "admin.data.sounds", created_at: new Date(), updated_at: new Date() },
      { name: "Ajouter un son", code: "admin.data.sounds.add", created_at: new Date(), updated_at: new Date() },
      { name: "Modifier un son", code: "admin.data.sounds.edit", created_at: new Date(), updated_at: new Date() },
      { name: "Supprimer un son", code: "admin.data.sounds.delete", created_at: new Date(), updated_at: new Date() },
      { name: "Activer/Désactiver un son", code: "admin.data.sounds.active", created_at: new Date(), updated_at: new Date() },
      { name: "Types", code: "admin.data.types", created_at: new Date(), updated_at: new Date() },
      { name: "Ajouter un type", code: "admin.data.types.add", created_at: new Date(), updated_at: new Date() },
      { name: "Modifier un type ", code: "admin.data.types.edit", created_at: new Date(), updated_at: new Date() },
      { name: "Supprimer un type", code: "admin.data.types.delete", created_at: new Date(), updated_at: new Date() },
      { name: "Activer/Désactiver un type", code: "admin.data.types.active", created_at: new Date(), updated_at: new Date() },
      { name: "Profils", code: "admin.data.profiles", created_at: new Date(), updated_at: new Date() },
      { name: "Ajouter un profil", code: "admin.data.profiles.add", created_at: new Date(), updated_at: new Date() },
      { name: "Modifier un profil", code: "admin.data.profiles.edit", created_at: new Date(), updated_at: new Date() },
      { name: "Supprimer un profil", code: "admin.data.profiles.delete", created_at: new Date(), updated_at: new Date() },
      { name: "Droits", code: "admin.data.rights", created_at: new Date(), updated_at: new Date() },
      { name: "Ajouter un droit", code: "admin.data.rights.add", created_at: new Date(), updated_at: new Date() },
      { name: "Modifier un droit", code: "admin.data.rights.edit", created_at: new Date(), updated_at: new Date() },
      { name: "Supprimer un droit", code: "admin.data.rights.delete", created_at: new Date(), updated_at: new Date() },
    ])
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}