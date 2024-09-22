import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import AuthController from '#controllers/auth_controller'

export default class IsAdminMiddleware {
  async handle({ request, response }: HttpContext, next: NextFn) {
    const uuid = request.cookie('uuid')
    const isAdmin = await AuthController.isAdmin(uuid)

    if(!isAdmin){
      return response.send({
        error: "not allowed",
        message: "Vous n'avez pas les droits pour accéder à cette ressource"
      })
    } else {
      const output = await next()
      return output
    }
  }
}