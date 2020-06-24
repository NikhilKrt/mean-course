const express = require('express');
const multer = require('multer');
const router = express.Router();
const Post = require("../models/post").model;

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isvalid = MIME_TYPE_MAP(file.mietype);
    let error = new Error("Invalid mime type");
    if(isvalid) {
      error = null;
    }
    cb(null, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.tolowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP(file.mietype);
    cb(null, name + '-' + Date.now() + '-' + ext);
  }
});

router.post("/", multer({storage: storage}).single("image"), (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: "Post added successfully",
      post: {
        ...createdPost,
        id: createdPost._id
      }
    });
  });
});

router.put("/:id", multer({storage: storage}).single("image"), (req, res, next) => {
  let imagePath = req.body.imagePath;
  if(req.file) {
     const url = req.protocol + '://' + req.get("host");
     imagePath = url + "/images/" + req.file.filename;
  }
  const post = {
    title: req.body.title,
    content: req.body.content
  };
  Post.findOneAndUpdate({_id: req.params.id}, {$set: post})
    .then((result) => {
      console.log(result);
      res.status(200).json({message: 'Update successfull!'})
    })
});

router.get("/", (req, res, next) => {
  Post.find().then(documents => {
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: documents
    });
  });
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      if(post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({message: "Post not found"});
      }
    })
});

router.delete("/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: "Post deleted!" });
  });
});

module.exports = router;
