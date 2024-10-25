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
import NetworksController from '#controllers/networks_controller'
import QuestionsController from '#controllers/questions_controller'

// Utiliser le middleware IsConnected :
// .use(
//   middleware.IsConnectedMiddleware()
// )

// Utiliser le middleware IsAdmin :
// .use(
//   middleware.IsAdminMiddleware()
// )

// New version : 

// .use(middleware.auth({
//   guards: ["api"]
// }))

// .use(
//   middleware.admin()
// )

router.get("/", [CategoriesController, "index"]);

router
  .group(() => {
    router.post("/login", [AuthController, "login"])
    router.post("/register", [AuthController, "register"])
  })
  .prefix('/auth')

router
  .group(() => {
    
    router
      .group(() => {
        router.get("/", [CategoriesController, "index"])
        router.put("/", [CategoriesController, "create"])
        router.patch("/:id", [CategoriesController, "update"])
        router.delete("/:id", [CategoriesController, "delete"])
      })
      .prefix("/categories")

    router
      .group(() => {
        router.get("/", [TypesController, "index"])
        router.put("/", [TypesController, "create"])
        router.patch("/:id", [TypesController, "update"])
        router.delete("/:id", [TypesController, "delete"])
      })
      .prefix("/types")

    router
      .group(() => {
        router.get("/", [SoundsController, "index"])
        router.put("/", [SoundsController, "create"])
        router.patch("/:id", [SoundsController, "update"])
        router.delete("/:id", [SoundsController, "delete"])
      })
      .prefix("/sounds")

    router
      .group(() => {
        router.get("/", [LicensesController, "index"])
        router.put("/", [LicensesController, "create"])
        router.patch("/:id", [LicensesController, "update"])
        router.delete("/:id", [LicensesController, "delete"])
      })
      .prefix("/licenses")

    router
      .group(() => {
        router.get("/", [NetworksController, "index"])
        router.put("/", [NetworksController, "create"])
        router.patch("/:id", [NetworksController, "update"])
        router.delete("/:id", [NetworksController, "delete"])
      })
      .prefix("/networks")

    router
      .group(() => {
        router.get("/", [QuestionsController, "index"])
        router.put("/", [QuestionsController, "create"])
        router.patch("/:id", [QuestionsController, "update"])
        router.delete("/:id", [QuestionsController, "delete"])
      })
      .prefix("/questions")
  })
  // .use(
  //   middleware.admin()
  // )
