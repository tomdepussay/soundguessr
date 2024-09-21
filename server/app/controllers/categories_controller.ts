import type { HttpContext } from '@adonisjs/core/http'

export default class CategoriesController {
    public async index({ response }: HttpContext) {
        response.send('Hello from the index action of the CategoriesController')
    }
    
    public async show({ response }: HttpContext) {
        response.send('Hello from the show action of the CategoriesController')
    }
    
    public async destroy({ response }: HttpContext) {
        response.send('Hello from the destroy action of the CategoriesController')
    }
    
    public async update({ response }: HttpContext) {
        response.send('Hello from the update action of the CategoriesController')
    }
}