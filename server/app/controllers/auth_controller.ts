import type { HttpContext } from '@adonisjs/core/http'
import { login, register } from "#validators/auth"
import User from "#models/user"
import Session from "#models/session"
import { DateTime } from 'luxon'
import { randomUUID } from 'crypto'

export default class AuthController {
    
    public async login({ request, response }: HttpContext){
        const { email, password } = await login.validate(request.all())

        const user = await User.verifyCredentials(email, password)
        
        if(!user.isActive){
            throw new Error("Votre compte est désactivé")
        }

        const hasSessions = await Session.query().where("user_id", user.id).where("is_revoked", false).where("expiresAt", ">", DateTime.now().toJSDate()).exec();

        let session = null
        if(hasSessions.length > 0){
            session = hasSessions[0]
        } else {
            session = await Session.create({
                userId: user.id,
                uuid: randomUUID(),
                isRevoked: false,
                expiresAt: DateTime.now().plus({ years: 1 })
            })
        }

        response.cookie('uuid', session.uuid, {
            httpOnly: true,
            sameSite: 'lax',
            secure: true,
            expires: session.expiresAt?.toJSDate()
        })

        return {
            success: true,
            message: "Vous êtes connecté",
            uuid: session.uuid
        }
    }

    public async register({ request }: HttpContext){
        const { username, email, password } = await register.validate(request.all())

        const hash = await User.hashPassword(password)

        const user = await User.create({ username, email, password: hash })

        return user
    }

    public static async isConnected(uuid: string){
      let isConnected = false;

      if(uuid){
        const session = await Session.query()
          .where('uuid', uuid)
          .where("is_revoked", false)
          .where("expires_at", ">", DateTime.now().toJSDate())
          .orderBy("id", "desc")
          .limit(1)
          .exec();
          
        if(session && session.length > 0 && session[0].userId){
          isConnected = true
        }
      }

      return isConnected
    }

    public static async isAdmin(uuid: string){
      let isAdmin = false;

      if(uuid){
        const session = await Session.query()
          .where('uuid', uuid)
          .where("is_revoked", false)
          .where("expires_at", ">", DateTime.now().toJSDate())
          .orderBy("id", "desc")
          .limit(1)
          .exec();
          
        if(session && session.length > 0 && session[0].userId){
          const user = await User.find(session[0].userId)
          if(user){
            isAdmin = user.isAdmin
          }
        }
      }
      
      return isAdmin
    }
}