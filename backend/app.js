const express 	= require('express');
const app 		= express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post').model;

mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true})
	.then(() => {
		console.log('Connected to DB');
	})
	.catch(() => {
		console.log('Connection failed');
	})

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-with, Content-Type, Accept");
	req.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
	next();
});

app.post('/api/posts', (req, res, next) => {
	const post = new Post({
		title: req.body.title,
		content: req.body.content
	});

	post.save().then((createdPost) => {
		res.status(201).json({
			message: "Post created",
			postId: createdPost._id
		});
	})
});

app.get('/api/posts',(req, res, next) => {
	Post.find()
		.then((postDocuments) => {
			res.status(200).json({
				message: "Post fetched successfully!",
				posts: postDocuments
			});
		})
		.catch((postErr) => {
			console.log(postErr)
		});
});

ap.delete('/api/posts/:id', (req, res, next) => {
	Post.deleteOne({_id: req.params.id})
		.then((result) => {
			res.status(200).json({message: "Post deleted successfully!"});
		})
		.catch((deleteErr) => {
			console.log(deleteErr);
		});
});

module.exports = app;
