const products = require('../Models/productModule')

//filter,sorting and paginating

class Apifeatures {
    constructor(query, queryString) {
        this.query;
        this.queryString = queryString;
    }
    filtering() {
        const queryObj = { ...this.queryString } //queryString=req.query  
        console.log({ befor: queryObj });//befor delete page
        const excludeFields = ['page', 'sort', 'limit']
        excludeFields.forEach(el => delete (queryObj[el]))

        console.log({ after: queryObj });//after deleted page

        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)|b/g, match => '$' + match)

        console.log({queryStr})
        //gte= greater than or equal
        //lte=lesser than or equal
         //lt=lesser than 
          //gt=greater than 
           


this.query.find(JSON.parse(queryStr))

        return this;
    }

    sorting() { 
        if (this.queryString.sort) {
           const sortBy = this.queryString.sort.split(',').join('')
           this.query = this.query.sort(sortBy)
        }else{
            this.query = this.query.sort('-createdAt')
        }
        return this;
    }

    paginating() {

        const page  = this.queryString.page *1||1
        const limit = this.queryString.limit *1||9
        const skip = (page - 1)*limit;
        this.query = this.query.skip().limit(limit)

        return this;
     }


}







const productController = {
    getProducts: async (req, res) => {
        try {
            console.log(req.query);
            const features = new Apifeatures(products.find(), req.query)
.filtering().sorting().paginating()
            const products = await features.query

            res.json({
                status:'success',
                result:products.length,
                products:products
            })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },

    createProduct: async (req, res) => {
        try {
            const { product_id, title, price, description, content, images, category } = req.body;
            if (!images) {
                return res.status(400).json({ msg: "No image upload" })
            }

            const product = await products.findOne({ product_id })
            if (product) {
                return res.status(400).json({ msg: "This product already exist" })
            }

            const newProduct = new products({
                product_id, title: title.tolowerCase(), price, description, content, images, category
            })
            await newProduct.save()

            res.json({ msg: "Created a product " })





        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },

    deleteProduct: async (req, res) => {
        try {

            await products.findByIdAndDelete(req.params.id)
            res.json({ msg: "Deleted a product" })

        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },

    updateProduct: async (req, res) => {
        try {
            const { title, price, description, content, images, category } = req.body;
            if (!images) {
                return res.status(400).json({ msg: "No image upload" })
            }
            await products.findOneAndUpdate({ _id: req.params.id }, {
                title: title.tolowerCase(), price, description, content, images, category
            })
            res.json({ msg: "Updated a product" })

        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    }
}




module.exports = productController