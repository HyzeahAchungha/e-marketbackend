const User =require('../Models/userModel')

const AuthAdmin = async(req,res,next)=>{
try {
 //get user information by id
 const user =await User.findOne({
   _id:req.user.id 
 })
 if (user.role ==0) {
    return res.status(400).json({msg:'Admin resources access denied'}) 
 }
 next()


} catch (error) {
    return res.status(500).json({msg:error.message})
}



} 


module.exports=AuthAdmin
