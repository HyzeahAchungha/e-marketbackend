const router = require('express').Router()
const cloudinary = require('cloudinary')
const Auth = require('../Middleware/Auth')
const AuthAdmin = require('../Middleware/AuthAdmin')
const fs = require('fs')
const { error } = require('console')


//we will upload image on cloudinary

cloudinary.config({
    cloud_name: process.env.cloud_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.COULD_API_SECRET
})
// upload image only admin can use
router.post('/upload', (req, res) => {
    try {
        console.log(req.files);

        if (!req.files || object.key(req.files).lenght === 0) {
            return res.status(400).send('no files were uploaded')
        }
        const file = req.files.file
        if (file.size > 1024 * 1024) {
            removeTmp(file.tempFilePath)
            return res.status(400).json({ msg: 'size too large' })
        }
        if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
            removeTmp(file.tempFilePath)
            return res.status(400).json({ msg: 'file formart is incorrect' })
        }

        cloudinary.v2.uploader.upload(file.tempFilePath,{folder:"test"},async(error,result)=>{
             if (error) throw error;{

                removeTmp(file.tempFilePath)
                res.status({public_id:result.public_id,url: result.secure_url} )
             }
        })


        // res.json('test upload')

    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
})

//Delete image
router.post("destroy",(req,res)=>{
    try {
        const {public_id}= req.body;
        if (!public_id) {
         return res.status(400).json({msg:"no image selected"})   
        } 
        
        cloudinary.v2.uploader.destroy(public_id,async(error,result)=>{
            if (error) throw error;{
                return res.json({msg:"Delete Image"})
            }
        })

    } catch (error) {
      return res.status(500).json({msg:error.message})  
    }
   
})




const removeTmp = (path)=>{
fs.unlink(path,error=>{
    if(error)throw error
})

}

module.exports = router

