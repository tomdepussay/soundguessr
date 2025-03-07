import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'rights'

  async up() {
    await this.db.table(this.tableName).insert([
      { id: 1, name: "Accès administrateur", code: "admin", parent_id: null, created_at: new Date(), updated_at: new Date() },

      { id: 2, name: "Gestion des données", code: "admin.data", parent_id: 1, created_at: new Date(), updated_at: new Date() },
      { id: 3, name: "Gestion des utilisateurs", code: "admin.users", parent_id: 1, created_at: new Date(), updated_at: new Date() },
      { id: 4, name: "Gestion des parties", code: "admin.games", parent_id: 1, created_at: new Date(), updated_at: new Date() },

      { id: 5, name: "Catégories", code: "admin.data.categories", parent_id: 2, created_at: new Date(), updated_at: new Date() },
      { id: 6, name: "Ajouter un catégorie", code: "admin.data.categories.add", parent_id: 5, created_at: new Date(), updated_at: new Date() },
      { id: 7, name: "Modifier une catégorie", code: "admin.data.categories.edit", parent_id: 5, created_at: new Date(), updated_at: new Date() },
      { id: 8, name: "Supprimer une catégorie", code: "admin.data.categories.delete", parent_id: 5, created_at: new Date(), updated_at: new Date() },
      { id: 9, name: "Activer/Désactiver une catégorie", code: "admin.data.categories.active", parent_id: 5, created_at: new Date(), updated_at: new Date() },
      { id: 10, name: "Détails d'une catégorie", code: "admin.data.categories.details", parent_id: 5, created_at: new Date(), updated_at: new Date() },

      { id: 11, name: "Licences", code: "admin.data.licenses", parent_id: 2, created_at: new Date(), updated_at: new Date() },
      { id: 12, name: "Ajouter une licence", code: "admin.data.licenses.add", parent_id: 11, created_at: new Date(), updated_at: new Date() },
      { id: 13, name: "Modifier une licence", code: "admin.data.licenses.edit", parent_id: 11, created_at: new Date(), updated_at: new Date() },
      { id: 14, name: "Supprimer une licence", code: "admin.data.licenses.delete", parent_id: 11, created_at: new Date(), updated_at: new Date() },
      { id: 15, name: "Activer/Désactiver une licence", code: "admin.data.licenses.active", parent_id: 11, created_at: new Date(), updated_at: new Date() },
      { id: 16, name: "Détails d'une licence", code: "admin.data.licenses.details", parent_id: 11, created_at: new Date(), updated_at: new Date() },

      { id: 17, name: "Sons", code: "admin.data.sounds", parent_id: 2, created_at: new Date(), updated_at: new Date() },
      { id: 18, name: "Ajouter un son", code: "admin.data.sounds.add", parent_id: 17, created_at: new Date(), updated_at: new Date() },
      { id: 19, name: "Modifier un son", code: "admin.data.sounds.edit", parent_id: 17, created_at: new Date(), updated_at: new Date() },
      { id: 20, name: "Supprimer un son", code: "admin.data.sounds.delete", parent_id: 17, created_at: new Date(), updated_at: new Date() },
      { id: 21, name: "Activer/Désactiver un son", code: "admin.data.sounds.active", parent_id: 17, created_at: new Date(), updated_at: new Date() },
      { id: 22, name: "Détails d'un son", code: "admin.data.sounds.details", parent_id: 17, created_at: new Date(), updated_at: new Date() },

      { id: 23, name: "Types", code: "admin.data.types", parent_id: 2, created_at: new Date(), updated_at: new Date() },
      { id: 24, name: "Ajouter un type", code: "admin.data.types.add", parent_id: 23, created_at: new Date(), updated_at: new Date() },
      { id: 25, name: "Modifier un type", code: "admin.data.types.edit", parent_id: 23, created_at: new Date(), updated_at: new Date() },
      { id: 26, name: "Supprimer un type", code: "admin.data.types.delete", parent_id: 23, created_at: new Date(), updated_at: new Date() },
      { id: 27, name: "Activer/Désactiver un type", code: "admin.data.types.active", parent_id: 23, created_at: new Date(), updated_at: new Date() },
      { id: 28, name: "Détails d'un type", code: "admin.data.types.details", parent_id: 23, created_at: new Date(), updated_at: new Date() },

      { id: 29, name: "Rôles", code: "admin.data.roles", parent_id: 2, created_at: new Date(), updated_at: new Date() },
      { id: 30, name: "Ajouter un rôle", code: "admin.data.roles.add", parent_id: 29, created_at: new Date(), updated_at: new Date() },
      { id: 31, name: "Modifier un rôle", code: "admin.data.roles.edit", parent_id: 29, created_at: new Date(), updated_at: new Date() },
      { id: 32, name: "Supprimer un rôle", code: "admin.data.roles.delete", parent_id: 29, created_at: new Date(), updated_at: new Date() },
      { id: 33, name: "Affecter des droits", code: "admin.data.roles.affect", parent_id: 29, created_at: new Date(), updated_at: new Date() },
      { id: 34, name: "Détails d'un rôle", code: "admin.data.roles.details", parent_id: 29, created_at: new Date(), updated_at: new Date() },

      { id: 35, name: "Droits", code: "admin.data.rights", parent_id: 2, created_at: new Date(), updated_at: new Date() },
      { id: 36, name: "Ajouter un droit", code: "admin.data.rights.add", parent_id: 35, created_at: new Date(), updated_at: new Date() },
      { id: 37, name: "Modifier un droit", code: "admin.data.rights.edit", parent_id: 35, created_at: new Date(), updated_at: new Date() },
      { id: 38, name: "Supprimer un droit", code: "admin.data.rights.delete", parent_id: 35, created_at: new Date(), updated_at: new Date() },
      { id: 39, name: "Détails d'un droit", code: "admin.data.rights.details", parent_id: 35, created_at: new Date(), updated_at: new Date() },
    ])
  }

  async down() {
  }
}