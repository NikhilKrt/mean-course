const express   = require('express');
const multer    = require('multer');
const router    = express.Router();
const Post      = require("../models/post").model;
const checkAuth = require('../middleware/check-auth');

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

router.post("/", checkAuth, multer({storage: storage}).single("image"), (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  const post = new Post({
    title     : req.body.title,
    content   : req.body.content,
    imagePath : url + "/images/" + req.file.filename,
    creator   : req.userData.userId
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

router.put("/:id", checkAuth, multer({storage: storage}).single("image"), (req, res, next) => {
  let imagePath = req.body.imagePath;
  if(req.file) {
     const url = req.protocol + '://' + req.get("host");
     imagePath = url + "/images/" + req.file.filename;
  }
  const post = {
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  };
  Post.findOneAndUpdate(
    {_id: req.params.id, creator: req.userData.userId}, 
    {$set: post}
  )
    .then((result) => {
      if(result.nModified > 0) {
        res.status(200).json({message: 'Update successfull!'});
      } else {
        res.status(401).json({message: 'Not authorized'})
      }
    });
});

router.get("/", (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const pageQuery = Post.find();
  let fetchedPosts;
  if(pageSize && currentPage) {
    pageQuery
      .skip(pageSize * (currentPage + 1))
      .limit(pageSize);
  }
  pageQuery.find().then(documents => {
    fetchedPosts = documents;
    return Post.count();
  })
    .then((count) => {
      res.status(200).json({
        message: "",
        posts: fetchedPosts,
        maxPosts: count
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

router.delete("/:id", checkAuth, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
      if(result.n > 0) {
          res.status(200).json({ message: "Post deleted!" });
        } else {
          res.status(401).json({message: 'Not authorized'})
        }
    });
});

module.exports = router;
