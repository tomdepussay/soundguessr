import type { HttpContext } from '@adonisjs/core/http'
import { typeValidator } from "#validators/type"
import Type from '#models/type';
import env from '#start/env';

export default class TypesController {
    public async index({ request, response }: HttpContext) {
        const page = parseInt(request.input("page")) || 1
        const limit = env.get("PAGINATION_LIMIT_MIN")

        const types = await Type.query().paginate(page, limit)

        return response.status(200).json({
            success: true,
            types
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

        await type.delete()

        return response.status(200).json({
            success: true,
            message: "Le type a été supprimé."
        })
    }
}