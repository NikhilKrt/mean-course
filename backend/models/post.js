const mongoose 	= require('mongoose');
const Schema 	= mongoose.Schema;

const postSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true
	},
	imagePath: {
		type: String,
		required: true
	},
	creator: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	}
});

const postModel = mongoose.model('Posts', postSchema);

module.exports = {
	model: postModel
};
