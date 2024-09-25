import type { HttpContext } from '@adonisjs/core/http'
import { networkValidator } from '#validators/network'
import Network from '#models/network'
import app from '@adonisjs/core/services/app'
import fs from 'fs'
import env from '#start/env'

export default class NetworksController {

    public async index({ request, response }: HttpContext){
        const page = parseInt(request.input("page")) || 1
        const limit = env.get("PAGINATION_LIMIT_MIN")

        const networks = await Network.query().paginate(page, limit)

        networks.forEach(network => {
            if(network.path){
                let path = app.makePath('resources', 'networks', network.path)
                if(fs.existsSync(path)){
                    const logo = fs.readFileSync(path, { encoding: 'base64' })
                    network.logo = `data:image/png;base64,${logo}`
                }
            }
        })

        return response.status(200).json({
            success: true,
            networks
        })
    }
    
    public async create({ request, response }: HttpContext){
        const { name, link, isActive } = await networkValidator.validate(request.all())

        const file = request.file('file', {
            size: '2mb',
            extnames: ['jpg', 'png', 'jpeg']
        })
        
        if(!file){
            return response.status(400).json({
                success: false,
                message: "Veuillez fournir un fichier."
            })
        }

        if(file.hasErrors){
            return response.status(400).json({
                success: false,
                message: file.errors
            })
        }

        const networkExist = await Network.findBy("name", name)

        if(networkExist){
            return response.status(400).json({
                success: false,
                message: "Ce réseau existe déjà."
            })
        }

        const fileName = `${new Date().getTime()}.${file.extname}`

        const path = app.makePath('resources', 'networks')

        await file.move(path, {
            name: fileName
        })

        const network = await Network.create({ name, link, isActive, path: fileName })      
        
        return response.status(201).json({
            success: true,
            message: "Le réseau a été créée.",
            network
        })
    }
    
    public async update({ request, response }: HttpContext){
        const id = request.param("id")
        const { name, link, isActive } = await networkValidator.validate(request.all())

        const file = request.file('file', {
            size: '2mb',
            extnames: ['jpg', 'png', 'jpeg']
        })

        const network = await Network.find(id)

        if(!network){
            return response.status(404).json({
                success: false,
                message: "Ce réseau n'existe pas."
            })
        }
        
        if(file){
            if(file.hasErrors){
                return response.status(400).json({
                    success: false,
                    message: file.errors
                })
            }

            const fileName = `${new Date().getTime()}.${file.extname}`

            const path = app.makePath('resources', 'networks')

            const oldPath = app.makePath('resources', 'networks', network.path)

            if(fs.existsSync(oldPath)){
                fs.unlinkSync(oldPath)
            }

            await file.move(path, {
                name: fileName
            })

            network.path = fileName
        }

        network.name = name
        network.link = link
        network.isActive = isActive

        await network.save()

        return response.status(200).json({
            success: true,
            message: "Le réseau a été modifié."
        })
    }

    public async delete({ request, response }: HttpContext){
        const id = request.param("id")

        const network = await Network.find(id)

        if(!network){
            return response.status(404).json({
                success: false,
                message: "Ce réseau n'existe pas."
            })
        }

        const path = app.makePath("resources", "networks", network.path)

        if(fs.existsSync(path)){
            fs.unlinkSync(path);
        }

        await network.delete()

        return response.status(200).json({
            success: true,
            message: "Ce réseau a été supprimé."
        })
    }
}