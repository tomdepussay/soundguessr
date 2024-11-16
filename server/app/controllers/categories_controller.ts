import type { HttpContext } from '@adonisjs/core/http'
import { categoryValidator } from "#validators/category"
import Category from "#models/category"
import env from '#start/env'
import db from '@adonisjs/lucid/services/db'
import License from '#models/license'
import LicensesController from './licenses_controller.js'

export default class CategoriesController {
    public async index({ request, response }: HttpContext){
        const page = parseInt(request.input("page")) || 1
        const search = request.input("search") || ""
        const limit = env.get("PAGINATION_LIMIT_MIN")

        const categories = await db
            .query()
            .leftJoin("licenses", "licenses.category_id", "categories.id")
            .from("categories")
            .select(
                "categories.id",
                "categories.name",
                "categories.is_active as isActive",
                db.raw("COUNT(licenses.id) as licenses_count")
            )
            .where("categories.name", "like", `%${search}%`)
            .groupBy("categories.id")
            .orderBy("categories.id", "desc")
            .paginate(page, limit)

        return response.status(200).json({
            success: true,
            categories
        })
    }

    public async show({ request, response }: HttpContext){
        const id = request.param("id")

        const category = await Category.query().where("id", id).first()

        if(!category){
            return response.status(404).json({
                success: false,
                message: "Cette catégorie n'existe pas."
            })
        }

        return response.status(200).json({
            success: true,
            category
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

        const licenses = await License.query().where("category_id", id)
        const licensesController = new LicensesController()

        if(licenses.length > 0){
            for(const license of licenses){
                await licensesController.deleteLicense(license)
            }
        }

        await category.delete()

        return response.status(200).json({
            success: true,
            message: "La catégorie a été supprimée."
        })
    }

    public async active({ request, response }: HttpContext){
        const id = request.param("id")

        const category = await Category.findBy("id", id);

        if(!category){
            return response.status(404).json({
                success: false,
                message: "Cette catégorie n'existe pas."
            })
        }

        category.isActive = !category.isActive

        await category.save()

        let message = category.isActive ? "La catégorie a été activée" : "La catégorie a été désactivée"

        return response.status(200).json({
            success: true,
            message
        })
    }
}