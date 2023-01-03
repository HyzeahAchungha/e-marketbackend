const router = require('express').Router()
const userControler = require('../Controllers/userControler')
const Auth = require('../Middleware/Auth')

router.post('/register', userControler.register)   
router.get('/refresh_token', userControler.refreshtoken)
router.post('/login', userControler.login)
router.get('/logout', userControler.logout)
router.get('/infor', Auth,userControler.getUser)










module.exports=router