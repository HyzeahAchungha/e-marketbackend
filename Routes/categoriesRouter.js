const router = require('express').Router()
const categoriesController=require('../Controllers/categoriesController')
const Auth =require('../Middleware/Auth')
const AuthAdmin = require('../Middleware/AuthAdmin')

router.route('/Categories')
.get(categoriesController.getCategories)
.post(Auth,AuthAdmin,categoriesController.createCategories)

router.route('/Categories/:id')

.delete(Auth,AuthAdmin,categoriesController.deleteCategories)
.put(Auth,AuthAdmin,categoriesController.updateCategories)

module.exports=router