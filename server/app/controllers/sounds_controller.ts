import License from '#models/license';
import Type from '#models/type';
import { soundValidator } from '#validators/sound'
import type { HttpContext } from '@adonisjs/core/http'
import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import app from '@adonisjs/core/services/app';
import Sound from '#models/sound';

export default class SoundsController {
    public async index({ request, response }: HttpContext){

    }

    public async create({ request, response }: HttpContext){
        const { title, url, before = 0, after = 0, order, isActive, licenseId, typeId } = await soundValidator.validate(request.all())

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
            const info = await ytdl.getInfo(url);
            const videoId = info.videoDetails.videoId;
            const stream = ytdl(url, {
                filter: 'audioonly',
                requestOptions: {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
                        'Accept-Language': 'en-US,en;q=0.9',
                        'Referer': 'https://www.youtube.com/'
                    }
                }
            });
            const fileName = `${new Date().getTime()}.mp3`;
            const path = app.makePath('resources', 'sounds', fileName);
            const videoDuration = parseInt(info.videoDetails.lengthSeconds);
        
            const duration = videoDuration - before - after;
            if (duration <= 0) {
                return response.status(400).json({
                    success: false,
                    message: "La durée de la vidéo est inférieure à 0 seconde."
                });
            }
        
            ffmpeg(stream)
                .audioBitrate(128)
                .setStartTime(before)
                .duration(duration)
                .format('mp3')
                .save(path)
                .on('end', () => {
                    console.log('Conversion terminée');
                    return response.status(200).json({
                        success: true,
                        message: "La vidéo a été ajoutée avec succès.",
                        path
                    });
                })
                .on('error', (err) => {
                    console.error('Erreur lors de la conversion avec ffmpeg :', err);
                    return response.status(400).json({
                        success: false,
                        message: "Une erreur est survenue lors de la conversion."
                    });
                })
                .run();
        
        } catch (e) {
            console.error('Erreur capturée:', e);
            return response.status(400).json({
                success: false,
                message: "Une erreur est survenue."
            });
        }
    
    }

    public async update({ request, response }: HttpContext){

    }

    public async delete({ request, response }: HttpContext){

    }
}