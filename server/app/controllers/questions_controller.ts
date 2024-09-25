import type { HttpContext } from '@adonisjs/core/http'
import { questionValidator } from '#validators/question'
import Question from '#models/question'
import Type from "#models/type"
import env from '#start/env'
import app from '@adonisjs/core/services/app'

export default class QuestionsController {

    public async index({ request, response }: HttpContext){
        const page = parseInt(request.input("page")) || 1
        const limit = env.get("PAGINATION_LIMIT_MIN")

        const questions = await Question.query().paginate(page, limit)

        return response.status(200).json({
            success: true,
            questions
        })
    }

    public async create({ request, response }: HttpContext){
        const { question, target, order, isActive, typeId } = await questionValidator.validate(request.all())

        const type = await Type.find(typeId)

        if(!type){
            return response.status(404).json({
                success: false,
                message: "Le type n'existe pas."
            })
        }

        const questionExist = await Question.findBy("question", question)

        if(questionExist){
            return response.status(400).json({
                success: false,
                message: "Cette question existe déjà."
            })
        }

        const createQuestion = await Question.create({ question, target, order, isActive, typeId })

        return response.status(200).json({
            success: true,
            message: "La question a été créée.",
            question: createQuestion
        })
    }

    public async update({ request, response }: HttpContext){
        const id = request.param("id")
        const { question, target, order, isActive, typeId } = await questionValidator.validate(request.all())

        const questionExist = await Question.find(id)

        if(!questionExist){
            return response.status(404).json({
                success: false,
                message: "La question n'existe pas."
            })
        }

        const type = await Type.find(typeId)

        if(!type){
            return response.status(400).json({
                success: false,
                message: "Le type n'existe pas."
            })
        }

        questionExist.question = question
        questionExist.target = target
        questionExist.order = order
        questionExist.isActive = isActive
        questionExist.typeId = typeId

        await questionExist.save()

        return response.status(200).json({
            success: true,
            message: "La question a été modifiée"
        })
        
    }

    public async delete({ request, response }: HttpContext){
        const id = request.param("id")

        const question = await Question.find(id)
        
        if(!question){
            return response.status(404).json({
                success: false,
                message: "La question n'existe pas"
            })
        }

        await question.delete()

        return response.status(200).json({
            success: true,
            message: "La question a été supprimée."
        })
    }
}