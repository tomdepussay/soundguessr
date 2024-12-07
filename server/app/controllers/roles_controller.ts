import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'
import db from '@adonisjs/lucid/services/db'
import Role from '#models/role'
import { roleValidator } from '#validators/role'

export default class RolesController {
    public async index({ request, response }: HttpContext){
        const page = parseInt(request.input("page")) || 1
        const search = request.input("search") || ""
        const limit = env.get("PAGINATION_LIMIT_MIN")

        const roles = await db
            .query()
            .leftJoin("users", "users.role_id", "roles.id")
            .from("roles")
            .select(
                "roles.id",
                "roles.name",
                "roles.description",
                db.raw("COUNT(users.id) as users_count")
            )
            .where("roles.name", "like", `%${search}%`)
            .groupBy("roles.id")
            .orderBy("roles.id", "asc")
            .paginate(page, limit)

        return response.status(200).json({
            success: true,
            roles
        })
    }

    public async show({ request, response }: HttpContext){
        const id = request.param("id")

        const role = await Role.query().where("id", id).first()

        if(!role){
            return response.status(404).json({
                success: false,
                message: "Ce rôle n'existe pas."
            })
        }

        return response.status(200).json({
            success: true,
            role
        })
    }

    public async add({ request, response }: HttpContext){
        const id = request.input("id")
        
        const maxColumnResult = await db
            .query()
            .from("rights")
            .select(db.raw('max(length(rights.code) - length(replace(rights.code, ".", "")) + 1) as max_elements'));
        
        const maxColumn = maxColumnResult[0].max_elements

        const rightsAffected = await db
            .query()
            .from("roles_rights")
            .select("right_id")
            .where("role_id", id);

        const rightsAffectedArray = rightsAffected.map((right) => (right.right_id))

        const rights = await db
            .query()
            .from("rights")
            .select("id", "name", "code", "parent_id AS parentId")
        
        return response.status(200).json({
            success: true,
            maxColumn,
            rightsAffected: rightsAffectedArray,
            rights
        })
    }

    public async create({ request, response }: HttpContext){
        const { name, description } = await roleValidator.validate(request.all())

        const existingRole = await Role.findBy("name", name);
        if(existingRole){
            return response.status(400).json({
                success: false,
                message: "Ce rôle existe déjà."
            })
        }

        const role = new Role()
        role.name = name
        role.description = description ?? null

        await role.save()

        return response.status(201).json({
            success: true,
            message: "Le rôle a été créé avec succès."
        })
    }

    public async update({ request, response }: HttpContext){
        const id = request.param("id")
        const { name, description } = await roleValidator.validate(request.all())

        const role = await Role.findBy("id", id);

        if(!role){
            return response.status(404).json({
                success: false,
                message: "Ce rôle n'existe pas."
            })
        }

        role.name = name
        role.description = description ?? null

        await role.save()

        return response.status(200).json({
            success: true,
            message: "Le rôle a été mis à jour avec succès."
        })
    }

    public async delete({ request, response }: HttpContext){
        const id = request.param("id")

        const role = await Role.findBy("id", id);

        if(!role){
            return response.status(404).json({
                success: false,
                message: "Ce rôle n'existe pas."
            })
        }

        await role.delete()

        return response.status(200).json({
            success: true,
            message: "Le rôle a été supprimé avec succès."
        })
    }

    public async affect({ request, response }: HttpContext){
        const id = request.param("id")
        const { rights } = request.all();

        const trx = await db.transaction()

        try {
            await trx
                .query()
                .from("roles_rights")
                .delete()
                .where("role_id", id);

            for(let right of rights){
                await trx
                    .table("roles_rights")
                    .insert({
                        role_id: id,
                        right_id: right
                    })
            }

            await trx.commit()

            return response.status(200).json({
                success: true,
                message: "Affectation des droits du rôle terminée"
            })
            
        } catch(e){
            await trx.rollback()
            return response.status(404).json({
                success: false,
                message: "Une erreur est survenue lors de l'attribution des droits"
            })
        }
    }
}