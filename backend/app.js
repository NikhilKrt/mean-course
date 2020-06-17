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

	post.save()
	res.status(201).json({
		message: "Post created"
	});
});

app.get('/api/posts',(req, res, next) => {
	const posts = [
		{ 
			id: "hchterwi7tbw74cb", 
			title: "First post", 
			content: "Content of first post" 
		},
		{ 
			id: "yu4trg3by4tb65", 
			title: "Second post", 
			content: "This is the second post from the server" 
		}
	]
	res.status(200).json({
		message: "Post fetched successfully!",
		posts: posts
	});
});

module.exports = app;
