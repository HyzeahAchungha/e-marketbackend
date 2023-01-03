const moongose = require('mongoose')

const productSchema = new moongose.Schema({
    product_id: {
        type: String,
        unique: true,
        trim: true,
        require: Boolean
    },
    title: {
        type: String,
        trim: true,
        require: true

    },
    price: {
        type: Number,
        trim: true,
        require: true
    },
    describtion: {
        type: String,
        require: true

    },
    content: {
        type: String,
        require: true

    },
    images: {
        type: Object,
        require: true

    },
    category: {
        type: String,
        require: true

    },
    checked: {
        type: Boolean,
        default: false

    },
    sold: {
        type: Number,
       default : 0

    },


},{
    timestamps:true//important
})
module.exports = moongose.model("products", productSchema)
