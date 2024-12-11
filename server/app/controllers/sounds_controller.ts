import License from '#models/license';
import Type from '#models/type';
import { soundValidator } from '#validators/sound'
import type { HttpContext } from '@adonisjs/core/http'
import ytdl from '@distube/ytdl-core';
import app from '@adonisjs/core/services/app';
import Sound from '#models/sound';
import fs from 'fs';
import { execSync } from 'child_process';
import env from '#start/env'
import db from '@adonisjs/lucid/services/db';
import OptionsByGroups from '#services/optionsByGroups';

export default class SoundsController {
    public async index({ request, response }: HttpContext){
        const page = parseInt(request.input("page")) || 1
        const search = request.input("search") || ""
        let filter = request.input("filter") || ""
        const limit = env.get("PAGINATION_LIMIT_MIN")

        if(filter == "license"){
            filter = "licenses.title"
        } else{
            filter = "sounds.title"
        }

        const sounds = await db
            .query()
            .join("licenses", "sounds.license_id", "licenses.id")
            .join("types", "sounds.type_id", "types.id")
            .from("sounds")
            .select(
                "sounds.id",
                "sounds.title",
                "sounds.order",
                'sounds.is_active AS isActive',
                "licenses.title AS license",
                "types.name AS type"
            )
            .where(filter, "LIKE", `%${search}%`)
            .orderBy("sounds.license_id", "asc")
            .orderBy("sounds.order", "asc")
            .paginate(page, limit)

        return response.status(200).json({
            success: true,
            sounds
        })
    }

    public async show({ request, response }: HttpContext){
        const id = request.param("id")

        const sound = await db
            .query()
            .join("licenses", "sounds.license_id", "licenses.id")
            .join("types", "sounds.type_id", "types.id")
            .from("sounds")
            .select(
                "sounds.id",
                "sounds.title",
                "sounds.url",
                "sounds.path",
                "sounds.order",
                "sounds.is_active AS isActive",
                "sounds.before",
                "sounds.after",
                "licenses.id AS licenseId",
                "licenses.title AS license",
                "types.id AS typeId",
                "types.name AS type"
            )
            .where("sounds.id", id)
            .first()

        if(!sound){
            return response.status(404).json({
                success: false,
                message: "Ce son n'existe pas."
            })
        }

        let path = app.makePath('resources', 'sounds', `${sound.path}`);
        sound.path = `resources/sounds/${sound.path}`;

        if(!fs.existsSync(path)){
            return response.status(404).json({
                success: false,
                message: "Le fichier n'existe pas."
            })
        } else {
            const file = fs.readFileSync(path, { encoding: 'base64' });
            const audio = `data:audio/mp3;base64,${file}`;
            sound.audio = audio;
        }

        return response.status(200).json({
            success: true,
            sound
        })
    }

    public async add({ response }: HttpContext){
        const query = await db
            .query()
            .join("categories", "licenses.category_id", "categories.id")
            .from("licenses")
            .select("licenses.id AS value", "licenses.title AS label", "categories.name AS groupLabel")
            .orderBy("categories.name", "asc")
        
        const licenses = OptionsByGroups(query);

        const queryTypes = await db
            .query()
            .from("types")
            .select("types.id AS value", "types.name AS label", db.raw("'Types' AS groupLabel"))
            .orderBy("types.name", "asc")

        const types = OptionsByGroups(queryTypes);
        
        return response.status(200).json({
            success: true,
            licenses,
            types
        })
    }

    public async getInfo(url: string){
        try {
            const infos = await ytdl.getBasicInfo(url);
            return infos;
        } catch (e) {
            return null;
        }
    }

    public async create({ request, response }: HttpContext){
        const { title, url, before = 0, after = 0, order, isActive, licenseId, typeId } = await soundValidator.validate(request.all())

        const soundExist = await Sound.findBy({ title });

        if(soundExist){
            return response.status(400).json({
                success: false,
                message: "Le son existe déjà."
            })
        }

        const license = await License.find(licenseId);

        if(!license){
            return response.status(400).json({
                success: false,
                message: "La licence n'existe pas."
            })
        }

        const type = await Type.find(typeId);

        if(!type){
            return response.status(400).json({
                success: false,
                message: "Le type n'existe pas."
            })
        }

        const clearUrl = url.split("&")[0];

        const infos = await this.getInfo(clearUrl);

        if (!clearUrl || !infos) {
            return response.status(400).json({
                success: false,
                message: "L'url n'est pas valide."
            })
        }

        try {
            const totalDuration = parseInt(infos.videoDetails.lengthSeconds);
            
            const fileName = `${license.categoryId}_${license.id}_${order}_${new Date().getTime()}.mp3`;
            const pathTemp = app.makePath('resources', 'sounds', "temp", `${fileName}`);
            const path = app.makePath('resources', 'sounds', `${fileName}`);

            let command = `ytdlp.exe -x --audio-format mp3 -o ${pathTemp} ${clearUrl}`;

            execSync(command);
                
            let command_cut = `ffmpeg -ss ${before} -to ${totalDuration - after} -i ${pathTemp} -c copy -loglevel quiet -hide_banner ${path}`;

            execSync(command_cut);

            fs.unlinkSync(pathTemp);

            const sound = await Sound.create({
                title,
                url: clearUrl,
                path: fileName,
                order,
                isActive,
                licenseId,
                typeId,
                before,
                after
            })

            return response.status(201).json({
                success: true,
                message: "Le son a été ajouté",
                sound
            })
        
        } catch (e) {
            console.error(e);
            return response.status(400).json({
                success: false,
                message: "Une erreur est survenue."
            });
        }
    }

    public async update({ request, response }: HttpContext){
        const id = request.param("id")
        const { title, url, before = 0, after = 0, order, isActive, licenseId, typeId } = await soundValidator.validate(request.all())
        
        const sound = await Sound.find(id)

        if(!sound){
            return response.status(404).json({
                success: false,
                messsage: "Ce son n'existe pas."
            });
        }

        const pathExist = app.makePath('resources', 'sounds', `${sound.path}`);

        if(fs.existsSync(pathExist)){
            fs.unlinkSync(pathExist)
        }

        const license = await License.find(licenseId);

        if(!license){
            return response.status(400).json({
                success: false,
                message: "La licence n'existe pas."
            })
        }

        const type = await Type.find(typeId);

        if(!type){
            return response.status(400).json({
                success: false,
                message: "Le type n'existe pas."
            })
        }

        if (!url || !ytdl.validateURL(url)) {
            return response.status(400).json({
                success: false,
                message: "L'url n'est pas valide."
            })
        }

        try {

            const infos = await ytdl.getInfo(url);
            const totalDuration = parseInt(infos.videoDetails.lengthSeconds);
            
            const fileName = `${license.categoryId}_${license.id}_${order}_${new Date().getTime()}.mp3`;
            const pathTemp = app.makePath('resources', 'sounds', "temp", `${fileName}`);
            const path = app.makePath('resources', 'sounds', `${fileName}`);

            let command = `ytdlp.exe -x --audio-format mp3 -o ${pathTemp} ${url}`;

            execSync(command);

            try {
                
                let command_cut = `ffmpeg -ss ${before} -to ${totalDuration - after} -i ${pathTemp} -c copy -loglevel quiet -hide_banner ${path}`;

                execSync(command_cut);

                fs.unlinkSync(pathTemp);

                sound.title = title
                sound.url = url
                sound.path = fileName
                sound.order = order
                sound.isActive = isActive
                sound.licenseId = licenseId
                sound.typeId = typeId
                sound.before = before
                sound.after = after

                await sound.save()

                return response.status(201).json({
                    success: true,
                    message: "Le son a été modifié",
                    sound
                })

            } catch (err) {
                console.log("Erreur2 : ", err)
                fs.unlinkSync(pathTemp);
                return response.status(400).json({
                    success: false,
                    message: "Une erreur est survenue."
                });
            }
        
        } catch (err) {
            console.log("Erreur1 : ", err)
            return response.status(400).json({
                success: false,
                message: "Une erreur est survenue."
            });
        }
    }

    public async delete({ request, response }: HttpContext){
        const id = request.param("id")

        const sound = await Sound.find(id)

        if(!sound){
            return response.status(404).json({
                success: false,
                messsage: "Ce son n'existe pas."
            });
        }
        
        await this.deleteSound(sound)

        return response.status(200).json({
            success: true,
            message: "Le son a été supprimé"
        })
    }

    public async deleteSound(sound: Sound){
        const path = app.makePath('resources', 'sounds', `${sound.path}`);

        if(fs.existsSync(path)){
            fs.unlinkSync(path)
        }

        return await sound.delete()
    }

    public async active({ request, response }: HttpContext){
        const id = request.param("id")

        const sound = await Sound.find(id)

        if(!sound){
            return response.status(404).json({
                success: false,
                messsage: "Ce son n'existe pas."
            });
        }

        sound.isActive = !sound.isActive

        await sound.save()

        let message = sound.isActive ? "Le son a été activé" : "Le son a été désactivé"

        return response.status(200).json({
            success: true,
            message
        })
    }
}