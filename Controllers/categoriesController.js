const Categories = require('../Models/categoriesModel')
const categoriesController = {
  getCategories: async (req, res) => {
    //  res.json('Categories test controller') 
    try {
      const categories = await Categories.find()
      res.json(categories)
    } catch (error) {
      return res.status(500).json({ msg: error.message })
    }
  },


  createCategories:async(req,res)=>{
try {
  //if user have role=1--->admin
  //only admin can create,delete and update categories
  const {name}=req.body;
  const categories = await Categories.findOne({name})
  if (categories ) {
    return res.status(400).json({msg:'This category already exists'})
  }
  const newCategory = new Categories({name})
  await newCategory.save()

  res.json({msg:"Created a category"})
} catch (error) {
  return res.status(500).json({msg:error.message})
}
  },
  deleteCategories:async(req,res)=>{
    try {
     await Categories.findByIdAndDelete(req.params.id)
     res.json({msg:"Deleted a category"}) 
    } catch (error) {
      return res.status(500).json({msg:error.message})
    }
  },

  updateCategories:async(req,res)=>{
    try {
     const {name} = req.body;
     await Categories.findOneAndUpdate({_id:req.params.id},{name})
     res.json({msg:"Update a category"})
    } catch (error) {
      return res.status(500).json({msg:error.message})
    }
  } 
}


module.exports = categoriesController