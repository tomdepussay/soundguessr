import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'
import db from '@adonisjs/lucid/services/db'
import Right from '#models/right'
import { rightValidator } from '#validators/right'

export default class RightsController {
    public async index({ request, response }: HttpContext){
        const page = parseInt(request.input("page")) || 1
        const search = request.input("search") || ""
        const limit = env.get("PAGINATION_LIMIT_MIN")

        const rights = await db
            .query()
            .leftJoin("profiles_rights", "profiles_rights.right_id", "rights.id")
            .leftJoin("profiles", "profiles.id", "profiles_rights.profile_id")
            .from("rights")
            .select(
                "rights.id",
                "rights.name",
                "rights.code",
                db.raw("COUNT(profiles.id) as profiles_count")
            )
            .where("rights.name", "like", `%${search}%`)
            .groupBy("rights.id")
            .orderBy("rights.id", "desc")
            .paginate(page, limit)

        return response.status(200).json({
            success: true,
            rights
        })
    }

    public async show({ request, response }: HttpContext){
        const id = request.param("id")

        const right = await Right.query().where("id", id).first()

        if(!right){
            return response.status(404).json({
                success: false,
                message: "Ce droit n'existe pas."
            })
        }

        return response.status(200).json({
            success: true,
            right
        })
    }

    public async create({ request, response }: HttpContext){
        const { name, code } = await rightValidator.validate(request.all())

        const existingRight = await Right.findBy("code", code);
        if(existingRight){
            return response.status(400).json({
                success: false,
                message: "Ce droit existe déjà."
            })
        }     

        const right = await Right.create({ name, code })

        return response.status(201).json({
            success: true,
            message: "Le droit a été créé.",
            right
        })
    }

    public async update({ request, response }: HttpContext){
        const id = request.param("id")
        const { name, code } = await rightValidator.validate(request.all())

        const right = await Right.findBy("id", id);

        if(!right){
            return response.status(404).json({
                success: false,
                message: "Ce droit n'existe pas."
            })
        }

        right.name = name
        right.code = code

        await right.save()

        return response.status(200).json({
            success: true,
            message: "Le droit a été modifié.",
            right
        })
    }

    public async delete({ request, response }: HttpContext){
        const id = request.param("id")

        const right = await Right.findBy("id", id);

        if(!right){
            return response.status(404).json({
                success: false,
                message: "Ce droit n'existe pas."
            })
        }

        await right.delete()

        return response.status(200).json({
            success: true,
            message: "Le droit a été supprimé."
        })
    }
}