import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import User from "#models/user"

export default class AdminMiddleware {
  async handle({ auth, response }: HttpContext, next: NextFn) {
    // Vérifie si l'utilisateur est authentifié
    await auth.check()

    // Si l'utilisateur n'est pas authentifié
    if (!auth.user) {
      return response.unauthorized({ message: 'Utilisateur non authentifié' })
    }

    // Vérifie si l'utilisateur est un administrateur
    if (!auth.user.isAdmin) {
      return response.forbidden({ message: 'Accès interdit. Administrateur requis' })
    }
    const output = await next()
    return output
  }
}