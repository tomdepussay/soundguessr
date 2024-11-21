import type { HttpContext } from '@adonisjs/core/http'
import { login, register } from "#validators/auth"
import User from "#models/user"
import db from '@adonisjs/lucid/services/db'

export default class AuthController {
    public async login({ request, response }: HttpContext){
        const { email, password } = await login.validate(request.all())

        const user = await User.findBy('email', email)

        if(user) {
            const passwordValid = await User.verifyPassword(user, password)

            if(passwordValid){
                if(user.isActive){
                    const token = await User.accessTokens.create(user)

                    const profileId = user.profileId;

                    const permissions = await db
                        .query()
                        .from("profiles_rights")
                        .leftJoin("rights", "profiles_rights.right_id", "rights.id")
                        .select("rights.code")
                        .where("profiles_rights.profile_id", profileId)
                    
                    const permissionsArray = permissions.map((permission: any) => permission.code)

                    token.abilities = permissionsArray
                    
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
        const user: { id: number, username: string, email: string, profileId: number, picture: string, permissions: string[] } = {
            id: userConnected.id,
            username: userConnected.username,
            email: userConnected.email,
            profileId: userConnected.profileId,
            picture: userConnected.picture,
            permissions: []
        }

        const permissions = await db
            .query()
            .from("profiles_rights")
            .leftJoin("rights", "profiles_rights.right_id", "rights.id")
            .select("rights.code")
            .where("profiles_rights.profile_id", user.profileId)
        
        const permissionsArray = permissions.map((permission: any) => permission.code)

        user.permissions = permissionsArray

        return {
            success: true,
            user
        }
    }    

    public async permission({ request, response, auth }: HttpContext){
        const { permission } = request.all();
        const user = await auth.authenticate()
        const profileId = user.profileId

        return response.status(200).json({
            success: true,
            hasRight: User.hasPermission(permission, profileId)
        })
            
    }
}