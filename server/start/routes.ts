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
import RolesController from '#controllers/roles_controller'
import RightsController from '#controllers/rights_controller'

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
    router.get("/user", [AuthController, "user"])
    // router.post("/permission", [AuthController, "permission"])
  })
  .prefix('/auth')

router
  .group(() => {
    
    router
      .group(() => {
        router.get("/", [CategoriesController, "index"])
        router.get("/:id", [CategoriesController, "show"])
        router.put("/", [CategoriesController, "create"])
        router.patch("/:id", [CategoriesController, "update"])
        router.delete("/:id", [CategoriesController, "delete"])
        router.patch("/active/:id", [CategoriesController, "active"])
      })
      .prefix("/categories")

    router
      .group(() => {
        router.get("/", [TypesController, "index"])
        router.get("/:id", [TypesController, "show"])
        router.put("/", [TypesController, "create"])
        router.patch("/:id", [TypesController, "update"])
        router.delete("/:id", [TypesController, "delete"])
        router.patch("/active/:id", [TypesController, "active"])
      })
      .prefix("/types")

    router
      .group(() => {
        router.get("/", [SoundsController, "index"])
        router.get("/add", [SoundsController, "add"])
        router.get("/:id", [SoundsController, "show"])
        router.put("/", [SoundsController, "create"])
        router.patch("/:id", [SoundsController, "update"])
        router.delete("/:id", [SoundsController, "delete"])
        router.patch("/active/:id", [SoundsController, "active"])
      })
      .prefix("/sounds")

    router
      .group(() => {
        router.get("/", [LicensesController, "index"])
        router.get("/add", [LicensesController, "add"])
        router.get("/:id", [LicensesController, "show"])
        router.put("/", [LicensesController, "create"])
        router.patch("/:id", [LicensesController, "update"])
        router.delete("/:id", [LicensesController, "delete"])
        router.patch("/active/:id", [LicensesController, "active"])
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

    router
      .group(() => {
        router.get("/", [RolesController, "index"])
        router.get("/add", [RolesController, "add"])
        router.get("/:id", [RolesController, "show"])
        router.put("/", [RolesController, "create"])
        router.patch("/:id", [RolesController, "update"])
        router.delete("/:id", [RolesController, "delete"])
        router.post("/affect/:id", [RolesController, "affect"])
      })
      .prefix("/roles")


    router
      .group(() => {
        router.get("/", [RightsController, "index"])
        router.get("/add", [RightsController, "add"])
        router.get("/:id", [RightsController, "show"])
        router.put("/", [RightsController, "create"])
        router.patch("/:id", [RightsController, "update"])
        router.delete("/:id", [RightsController, "delete"])
        router.post("/level", [RightsController, "level"])
      })
      .prefix("rights")
  })
  .use(
    middleware.auth()
  )