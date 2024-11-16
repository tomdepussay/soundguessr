import type { HttpContext } from '@adonisjs/core/http'
import { typeValidator } from "#validators/type"
import Type from '#models/type';
import env from '#start/env';
import db from '@adonisjs/lucid/services/db';
import SoundsController from './sounds_controller.js';
import Sound from '#models/sound';

export default class TypesController {
    public async index({ request, response }: HttpContext) {
        const page = parseInt(request.input("page")) || 1
        const search = request.input("search") || ""
        const limit = env.get("PAGINATION_LIMIT_MIN")

        const types = await db
            .query()
            .leftJoin("sounds", "sounds.type_id", "types.id")
            .from("types")
            .select(
                "types.id",
                "types.name",
                "types.is_active as isActive",
                db.raw("COUNT(sounds.id) as sounds_count")
            )
            .where("types.name", "like", `%${search}%`)
            .groupBy("types.id")
            .orderBy("types.id", "desc")
            .paginate(page, limit)

        return response.status(200).json({
            success: true,
            types
        })
    }

    public async show({ request, response }: HttpContext){
        const id = request.param("id")

        const type = await Type.query().where("id", id).first()

        if(!type){
            return response.status(404).json({
                success: false,
                message: "Ce type n'existe pas."
            })
        }

        return response.status(200).json({
            success: true,
            type
        })
    }
    
    public async create({ request, response }: HttpContext) {
        const { name, isActive } = await typeValidator.validate(request.all())

        const existingType = await Type.findBy("name", name);

        if(existingType){
            return response.status(400).json({
                success: false,
                message: "Ce type existe déjà."
            })
        }

        const type = await Type.create({ name, isActive })

        return response.status(201).json({
            success: true,
            message: "Le type a été créé.",
            type
        })
    }
    
    public async update({ request, response }: HttpContext) {
        const id = request.param("id")
        const { name, isActive } = await typeValidator.validate(request.all())
        
        const type = await Type.findBy("id", id);

        if(!type){
            return response.status(404).json({
                success: false,
                message: "Ce type n'existe pas."
            })
        }

        type.name = name
        type.isActive = isActive

        await type.save()

        return response.status(200).json({
            success: true,
            message: "Le type a été modifié.",
            type
        })
    }
    
    public async delete({ request, response }: HttpContext) {
        const id = request.param("id")

        const type = await Type.findBy("id", id);

        if(!type){
            return response.status(404).json({
                success: false,
                message: "Ce type n'existe pas."
            })
        }

        const sounds = await Sound.query().where("type_id", id)
        const soundsController = new SoundsController()

        if(sounds.length > 0){
            for(const sound of sounds){
                await soundsController.deleteSound(sound)
            }
        }

        await type.delete()

        return response.status(200).json({
            success: true,
            message: "Le type a été supprimé."
        })
    }

    public async active({ request, response }: HttpContext){
        const id = request.param("id")

        const type = await Type.findBy("id", id);

        if(!type){
            return response.status(404).json({
                success: false,
                message: "Ce type n'existe pas."
            })
        }

        type.isActive = !type.isActive

        await type.save()

        let message = type.isActive ? "Le type a été activé" : "Le type a été désactivé"

        return response.status(200).json({
            success: true,
            message
        })
    }
}