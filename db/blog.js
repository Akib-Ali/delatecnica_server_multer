const mongoose = require('mongoose')
const blogSchema = new mongoose.Schema({

    blog_title: {
        type: String,
        required:true
    },

    blog_slug: {
        type: String,
        required:true,
    },
    blog_summary: {
        type: String,
        required:true
    },
    blog_keyword: {
        type: String,
        required:true
    },
     image:String,

    blog_content: {
        type: String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }

})

module.exports = mongoose.model("dellatecnica_blogs",blogSchema)