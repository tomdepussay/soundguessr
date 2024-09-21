import AuthController from '#controllers/auth_controller'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class IsConnectedMiddleware {
  async handle({ request, response }: HttpContext, next: NextFn) {
    console.log("is connected middleware")
    const uuid = request.cookie('uuid')
    const isConnected = await AuthController.isConnected(uuid)

    if(!isConnected){
      return response.send({
        error: "not connected",
        message: "Vous devez être connecté pour accéder à cette ressource"
      })
    } else {
      const output = await next()
      return output
    }
  }
}