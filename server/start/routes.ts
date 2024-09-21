/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import AuthController from '#controllers/auth_controller'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import CategoriesController from '#controllers/categories_controller'

// Utiliser le middleware IsConnected :
// .use(
//   middleware.IsConnectedMiddleware()
// )

// Utiliser le middleware IsAdmin :
// .use(
//   middleware.IsAdminMiddleware()
// )

router
  .group(() => {
    router.post("login", [AuthController, "login"])
    router.post("register", [AuthController, "register"])
  })
  .prefix('auth')

