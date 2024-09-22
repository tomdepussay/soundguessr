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
// import SoundsController from '#controllers/sounds_controller'
import TypesController from '#controllers/types_controller'
import LicensesController from '#controllers/licenses_controller'
import SoundsController from '#controllers/sounds_controller'

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
    router.post("/login", [AuthController, "login"])
    router.post("/register", [AuthController, "register"])
  })
  .prefix('/auth')

router
  .group(() => {
    router.get("/", [CategoriesController, "index"])
    router.put("/", [CategoriesController, "create"])
    router.patch("/:id", [CategoriesController, "update"])
    router.delete("/:id", [CategoriesController, "delete"])
  })
  .prefix("/categories")
  .use(
    middleware.IsAdminMiddleware()
  )

router
  .group(() => {
    router.get("/", [TypesController, "index"])
    router.put("/", [TypesController, "create"])
    router.patch("/:id", [TypesController, "update"])
    router.delete("/:id", [TypesController, "delete"])
  })
  .prefix("/types")
  .use(
    middleware.IsAdminMiddleware()
  )

router
  .group(() => {
    router.get("/", [SoundsController, "index"])
    router.put("/", [SoundsController, "create"])
    router.patch("/:id", [SoundsController, "update"])
    router.delete("/:id", [SoundsController, "delete"])
  })
  .prefix("/sounds")
  .use(
    middleware.IsAdminMiddleware()
  )

router
  .group(() => {
    router.get("/", [LicensesController, "index"])
    router.put("/", [LicensesController, "create"])
    router.patch("/:id", [LicensesController, "update"])
    router.delete("/:id", [LicensesController, "delete"])
  })
  .prefix("/licenses")
  .use(
    middleware.IsAdminMiddleware()
  )