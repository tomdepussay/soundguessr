import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'
import db from '@adonisjs/lucid/services/db'
import Profile from '#models/profile'
import { profileValidator } from '#validators/profile'

export default class ProfilesController {
    public async index({ request, response }: HttpContext){
        const page = parseInt(request.input("page")) || 1
        const search = request.input("search") || ""
        const limit = env.get("PAGINATION_LIMIT_MIN")

        const profiles = await db
            .query()
            .leftJoin("users", "users.profile_id", "profiles.id")
            .from("profiles")
            .select(
                "profiles.id",
                "profiles.name",
                "profiles.description",
                db.raw("COUNT(users.id) as users_count")
            )
            .where("profiles.name", "like", `%${search}%`)
            .groupBy("profiles.id")
            .orderBy("profiles.id", "asc")
            .paginate(page, limit)

        return response.status(200).json({
            success: true,
            profiles
        })
    }

    public async show({ request, response }: HttpContext){
        const id = request.param("id")

        const profile = await Profile.query().where("id", id).first()

        if(!profile){
            return response.status(404).json({
                success: false,
                message: "Ce profil n'existe pas."
            })
        }

        return response.status(200).json({
            success: true,
            profile
        })
    }

    public async add({ request, response }: HttpContext){

        // Requete SELECT MAX(LENGTH(code) - LENGTH(REPLACE(code, '.', '')) + 1) AS max_elements
        // FROM rights;


        const maxColumnResult = await db
            .query()
            .from("rights")
            .select(db.raw('max(length(rights.code) - length(replace(rights.code, ".", "")) + 1) as max_elements'));
        
        const maxColumn = maxColumnResult[0].max_elements
        // const rights = await db.query().from("rights").select("id", "name", "code");

        // // Fonction pour créer la hiérarchie
        // const buildHierarchy = (rights: any) => {
        //   // Créer un objet pour regrouper les droits par leur parent
        //   const map: any = {};
        
        //   // Préparer les nœuds
        //   rights.forEach((right: any) => {
        //     map[right.code] = { 
        //       code: right.code,
        //       name: right.name,
        //       affected: false,
        //       rights: []
        //     };
        //   });
        
        //   // Construire la hiérarchie
        //   const result: any = [];
        //   rights.forEach((right: any) => {
        //     const parentCode = right.code.split('.').slice(0, -1).join('.');
        //     if (map[parentCode]) {
        //       map[parentCode].rights.push(map[right.code]);
        //     } else {
        //       result.push(map[right.code]);
        //     }
        //   });
        
        //   return result;
        // };

        // // Fonction pour calculer la profondeur maximale
        // const calculateMaxDepth = (nodes: any[], depth = 1): number => {
        //     let maxDepth = depth;
        //     nodes.forEach((node) => {
        //         if (node.rights.length > 0) {
        //             maxDepth = Math.max(maxDepth, calculateMaxDepth(node.rights, depth + 1));
        //         }
        //     });
        //     return maxDepth;
        // };
        
        // // Construire la matrice
        // const matrix = buildHierarchy(rights);

        // // Calculer le nombre de colonnes max
        // const maxColumns = calculateMaxDepth(matrix);

        return response.status(200).json({
            success: true,
            maxColumn
        })
    }

    public async create({ request, response }: HttpContext){
        const { name, description } = await profileValidator.validate(request.all())

        const existingProfile = await Profile.findBy("name", name);
        if(existingProfile){
            return response.status(400).json({
                success: false,
                message: "Ce profil existe déjà."
            })
        }

        const profile = new Profile()
        profile.name = name
        profile.description = description ?? null

        await profile.save()

        return response.status(201).json({
            success: true,
            message: "Le profil a été créé avec succès."
        })
    }

    public async update({ request, response }: HttpContext){
        const id = request.param("id")
        const { name, description } = await profileValidator.validate(request.all())

        const profile = await Profile.findBy("id", id);

        if(!profile){
            return response.status(404).json({
                success: false,
                message: "Ce profil n'existe pas."
            })
        }

        profile.name = name
        profile.description = description ?? null

        await profile.save()

        return response.status(200).json({
            success: true,
            message: "Le profil a été mis à jour avec succès."
        })
    }

    public async delete({ request, response }: HttpContext){
        const id = request.param("id")

        const profile = await Profile.findBy("id", id);

        if(!profile){
            return response.status(404).json({
                success: false,
                message: "Ce profil n'existe pas."
            })
        }

        await profile.delete()

        return response.status(200).json({
            success: true,
            message: "Le profil a été supprimé avec succès."
        })
    }
}