import License from '#models/license'
import env from '#start/env'
import { licenseValidator } from '#validators/license'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import fs from 'fs'

export default class LicensesController {
    public async index({ request, response }: HttpContext){
        const page = parseInt(request.input("page")) || 1
        const limit = env.get("PAGINATION_LIMIT_MIN")

        const licenses = await License.query().paginate(page, limit)

        licenses.forEach(license => {
            if(license.path){
                let path = app.makePath('resources', 'licenses', license.path)
                if(fs.existsSync(path)){
                    const picture = fs.readFileSync(path, { encoding: 'base64' })
                    license.picture = `data:image/png;base64,${picture}`
                }
            }
        })

        return response.status(200).json({
            success: true,
            licenses
        })
    }

    public async create({ request, response }: HttpContext){
        const { title, top100, isActive, categoryId } = await licenseValidator.validate(request.all())
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

        const existingLicense = await License.findBy("title", title);

        if(existingLicense){
            return response.status(400).json({
                success: false,
                message: "Cette licence existe déjà."
            })
        }

        const fileName = `${new Date().getTime()}.${file.extname}`

        const resourcesPath = app.makePath('resources', 'licenses')

        await file.move(resourcesPath, {
            name: fileName
        })

        const license = await License.create({ title, top100, isActive, categoryId, path: fileName })      
        
        return response.status(201).json({
            success: true,
            message: "La licence a été créée.",
            license
        })
    }

    public async update({ request, response }: HttpContext){
        const id = request.param("id")
        const { title, top100, isActive, categoryId } = await licenseValidator.validate(request.all())
        const file = request.file('file', {
            size: '2mb',
            extnames: ['jpg', 'png', 'jpeg']
        })

        const license = await License.findBy("id", id);

        if(!license){
            return response.status(404).json({
                success: false,
                message: "Cette licence n'existe pas."
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

            const resourcesPath = app.makePath('resources', 'licenses')

            const oldPath = app.makePath('resources', 'licenses', license.path)

            if(fs.existsSync(oldPath)){
                fs.unlinkSync(oldPath)
            }

            await file.move(resourcesPath, {
                name: fileName
            })

            license.path = fileName
        }

        license.title = title
        license.top100 = top100
        license.isActive = isActive
        license.categoryId = categoryId

        await license.save()

        return response.status(200).json({
            success: true,
            message: "La licence a été modifiée.",
            license
        })
    }

    public async delete({ request, response }: HttpContext){
        const id = request.param("id")

        const license = await License.findBy("id", id);

        if(!license){
            return response.status(404).json({
                success: false,
                message: "Cette licence n'existe pas."
            })
        }

        const resourcesPath = app.makePath('resources', 'licenses', license.path)

        if(fs.existsSync(resourcesPath)){
            fs.unlinkSync(resourcesPath)
        }

        await license.delete()

        return response.status(200).json({
            success: true,
            message: "La licence a été supprimée."
        })
    }
}