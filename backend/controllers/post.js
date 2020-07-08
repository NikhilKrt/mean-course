const Post      = require("../models/post").model;

exports.createPost = (req, res, next) => {
	const url = req.protocol + '://' + req.get("host");
	const post = new Post({
		title     : req.body.title,
		content   : req.body.content,
		imagePath : url + "/images/" + req.file.filename,
		creator   : req.userData.userId
	});
	post.save()
    .then(createdPost => {
		res.status(201).json({
			message: "Post added successfully",
			post: {
			  ...createdPost,
			  id: createdPost._id
			}
		});
    })
    .catch(error => {
      res.status(500).json({
        message: 'Creating post failed!'
      })
    });
}

exports.updatePost = (req, res, next) => {
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
		if(result.n > 0) {
			res.status(200).json({message: 'Update successfull!'});
		} else {
			res.status(401).json({message: 'Not authorized!'})
		}
    })
    .catch(error => {
		res.status(500).json({
			message: "Couldn't update post!"
		})
    });
}

exports.getPosts = (req, res, next) => {
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
	})
	.catch(error => {
	  res.status(500).json({
	    message: 'Fetching posts failed!'
	  })
	});
}

exports.getPost = (req, res, next) => {
  	Post.findById(req.params.id)
    .then((post) => {
      if(post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({message: "Post not found"});
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching post failed!'
      })
    });
}

exports.deletePost = (req, res, next) => {
  	Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
	.then(result => {
	  if(result.n > 0) {
	      res.status(200).json({ message: "Post deleted!" });
	    } else {
	      res.status(401).json({message: 'Not authorized'})
	    }
	})
	.catch(error => {
	  res.status(500).json({
	    message: 'Deleting post failed!'
	  })
	});
}
