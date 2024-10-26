import type { HttpContext } from '@adonisjs/core/http'
import { login, register } from "#validators/auth"
import User from "#models/user"

export default class AuthController {
    public async login({ request, response }: HttpContext){
        const { email, password } = await login.validate(request.all())

        const user = await User.findBy('email', email)

        if(user) {
            const passwordValid = await User.verifyPassword(user, password)

            if(passwordValid){
                if(user.isActive){
                    const token = await User.accessTokens.create(user)
                    return {
                        success: true,
                        message: "Vous êtes connecté",
                        token
                    }
                } else {
                    return response.status(200).json({
                        success: false,
                        message: "Votre compte est inactif"
                    })
                }
            }
        }
        
        return response.status(200).json({
            success: false,
            message: "Les informations d'identification sont incorrectes"
        })
    }

    public async register({ request }: HttpContext){
        const { username, email, password } = await register.validate(request.all())

        const userExist = await User.findBy({ email, username });

        if(userExist){
            return {
                success: false,
                message: "L'utilisateur existe déjà."
            }
        }

        const hash = await User.hashPassword(password)

        const user = await User.create({ username, email, password: hash })

        return user
    }

    public async user({ auth }: HttpContext){
        const userConnected = await auth.authenticate()
        const user = {
            id: userConnected.id,
            username: userConnected.username,
            email: userConnected.email,
            isAdmin: userConnected.isAdmin,
            picture: userConnected.picture
        }
        return {
            success: true,
            user
        }
    }
}