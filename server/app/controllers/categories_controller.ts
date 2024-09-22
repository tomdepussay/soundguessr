import type { HttpContext } from '@adonisjs/core/http'
import { categoryValidator } from "#validators/category"
import Category from "#models/category"
import env from '#start/env'

export default class CategoriesController {
    public async index({ request, response }: HttpContext){
        const page = parseInt(request.input("page")) || 1
        const limit = env.get("PAGINATION_LIMIT_MIN")

        const categories = await Category.query().paginate(page, limit)

        return response.status(200).json({
            success: true,
            categories
        })
    }

    public async create({ request, response }: HttpContext){
        const { name, isActive } = await categoryValidator.validate(request.all())

        const existingCategory = await Category.findBy("name", name);
        if(existingCategory){
            return response.status(400).json({
                success: false,
                message: "Cette catégorie existe déjà."
            })
        }     

        const category = await Category.create({ name, isActive })

        return response.status(201).json({
            success: true,
            message: "La catégorie a été créée.",
            category
        })
    }

    public async update({ request, response }: HttpContext){
        const id = request.param("id")
        const { name, isActive } = await categoryValidator.validate(request.all())

        const category = await Category.findBy("id", id);

        if(!category){
            return response.status(404).json({
                success: false,
                message: "Cette catégorie n'existe pas."
            })
        }

        category.name = name
        category.isActive = isActive

        await category.save()

        return response.status(200).json({
            success: true,
            message: "La catégorie a été modifiée.",
            category
        })
    }

    public async delete({ request, response }: HttpContext){
        const id = request.param("id")

        const category = await Category.findBy("id", id);

        if(!category){
            return response.status(404).json({
                success: false,
                message: "Cette catégorie n'existe pas."
            })
        }

        await category.delete()

        return response.status(200).json({
            success: true,
            message: "La catégorie a été supprimée."
        })
    }
}