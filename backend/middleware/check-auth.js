const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		jwt.verify(token, 'secret_of_token');
		next();
	} catch(error) {
		res.ststus(401).json({ message: "Auth failed." });
	}
};
