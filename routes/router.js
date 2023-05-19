const express = require('express');
const router = new express.Router();
const conn = require('../db/conn')
const Blog = require("../db/blog")
const multer = require("multer")
const fs = require('fs');
const BASE_URL = process.env.BASE_URL

//img storage config

var imgconfig = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./uploads")
    },
    filename: (req, file, callback) => {
        callback(null, `image-${Date.now()}.${file.originalname}`)
    }
})

//image filter

const isImage = (req, file, callback) => {
    if (file.mimetype.startsWith('image')) {
        callback(null, true)
    } else {
        callback(null, Error("only image allowed"))
    }
}

var upload = multer({
    storage: imgconfig,
    fileFilter: isImage
})




//post api

router.post("/post-newblog", upload.single('photo'), async (req, res) => {
    try {
        const { blog_title, blog_slug, blog_summary, blog_keyword, blog_content } = req.body;

        const newBlog = new Blog({
            blog_title,
            blog_slug,
            blog_summary,
            blog_keyword,
            blog_content,
            createdAt: Date.now()

        })
        if (req.file) {
            newBlog.image = req.file.filename

        }
        let result = await newBlog.save();
        res.send(result)

    } catch (error) {
        console.log(error)

    }
    console.log(req.body)

})


//get api 

router.get('/blog-list', async (req, res) => {
    let bloglist = await Blog.find().sort({ createdAt: -1 });
    if (bloglist.length > 0) {
        res.send(bloglist)
    } else {
        res.send({ result: "No Result found" })
    }

})

//single blog api

router.get('/blog/:id', async(req,res)=>{
    let result = await Blog.findOne({_id:req.params.id})
    if(result){
        res.send(result)
    }else{
        res.send({result:"No Record found"})
    }
})



//update api

// router.post("/blogupdate/:id", async(req,res)=>{

//     let result = await Blog.updateOne(
//         {_id: req.params.id},
//         {
//             $set: req.body
//         }
//     )
//     res.send(result)
// })


router.post("/blogupdate/:id", async (req, res) => {
    try {
      const { blog_title, blog_slug, blog_summary, blog_keyword, blog_content } = req.body;
  
      let updateObject = {};
      if (blog_title) {
        updateObject.blog_title = blog_title;
      }
      if (blog_slug) {
        updateObject.blog_slug = blog_slug;
      }
      if (blog_summary) {
        updateObject.blog_summary = blog_summary;
      }
      if (blog_keyword) {
        updateObject.blog_keyword = blog_keyword;
      }
      if (blog_content) {
        updateObject.blog_content = blog_content;
      }
      if (req.file) {
        updateObject.image = req.file.filename;
      }
  
      const result = await Blog.updateOne(
        { _id: req.params.id },
        { $set: updateObject }
      );
  
      res.send(result);
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal server error");
    }
  });



//delete api

router.delete('/delete-blog/:_id', async (req, res) => {
    let deleteselectedblog = await Blog.deleteOne(req.params)
    res.send(deleteselectedblog)

})




module.exports = router;
