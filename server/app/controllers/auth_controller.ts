import type { HttpContext } from '@adonisjs/core/http'
import { login, register } from "#validators/auth"
import User from "#models/user"

export default class AuthController {
    public async login({ request, response }: HttpContext){
        const { email, password } = await login.validate(request.all())

        const user = await User.verifyCredentials(email, password)
        
        if(!user.isActive){
          return response.status(200).json({
            success: false,
            message: "Votre compte est inactif"
          })
        }

        const token = await User.accessTokens.create(user)

        return {
            success: true,
            message: "Vous êtes connecté",
            token
        }
    }

    public async register({ request }: HttpContext){
        const { username, email, password } = await register.validate(request.all())

        const hash = await User.hashPassword(password)

        const user = await User.create({ username, email, password: hash })

        return user
    }
}