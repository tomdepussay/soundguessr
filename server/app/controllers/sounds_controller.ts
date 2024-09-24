import License from '#models/license';
import Type from '#models/type';
import { soundValidator } from '#validators/sound'
import type { HttpContext } from '@adonisjs/core/http'
import ytdl from 'ytdl-core';
import app from '@adonisjs/core/services/app';
import Sound from '#models/sound';
import fs from 'fs';
import { execSync } from 'child_process';
import env from '#start/env'

export default class SoundsController {
    public async index({ request, response }: HttpContext){
        const page = parseInt(request.input("page")) || 1
        const limit = env.get("PAGINATION_LIMIT_MIN")

        const sounds = await Sound.query().paginate(page, limit)

        return response.status(200).json({
            success: true,
            sounds
        })
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

                const sound = await Sound.create({
                    title,
                    url,
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

            } catch (err) {
                fs.unlinkSync(pathTemp);
                return response.status(400).json({
                    success: false,
                    message: "Une erreur est survenue."
                });
            }
        
        } catch (e) {
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
                console.log(err)
                fs.unlinkSync(pathTemp);
                return response.status(400).json({
                    success: false,
                    message: "Une erreur est survenue."
                });
            }
        
        } catch (err) {
            console.log(err)
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

        const path = app.makePath('resources', 'sounds', `${sound.path}`);

        if(fs.existsSync(path)){
            fs.unlinkSync(path)
        }

        await sound.delete()

        return response.status(200).json({
            success: true,
            message: "Le son a été supprimé"
        })
    }
}