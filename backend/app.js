const express 	= require('express');
const app 		= express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-with, Content-Type, Accept");
	req.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
	next();
});

app.post('/api/posts', (req, res, next) => {
	const post = req.body;
	console.log(post);
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
