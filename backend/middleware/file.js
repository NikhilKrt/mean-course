const multer    = require('multer');

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

module.exports = multer({storage: storage}).single("image")
