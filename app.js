const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

const mongoose = require('mongoose');
const database = require('./config/database');

const cors = require('cors');

const rootModel = require('./model');
const rootController = require('./controller');

const PORT = process.env.PORT || 4000;
mongoose.connect(database.db, { useUnifiedTopology: true, useNewUrlParser: true });
mongoose.connection.on('error', () => { console.log('---FAILED to connect to mongoose') });
mongoose.connection.on('connected', () => { console.log('+++Connected to mongoose') });

const app = express();
app.use(cors({ origin: 'https://premchand0501.github.io' }));

// setup static files
app.use(express.static('public'));

// body parser setup
const urlencodedBodyParser = bodyParser.urlencoded({ extended: true })
const jsonBodyParser = bodyParser.json();
app.use(urlencodedBodyParser);
app.use(jsonBodyParser);
// -- Media folder
const storage = multer.diskStorage({
  destination: (req, res, callback) => {
    callback(null, './public/images');
  },
  filename: (req, file, callback) => {
    callback(null, file.fieldname + '_' + Date.now() + '_' + file.originalname);
  }
})
const mediaUploader = multer({
  storage
});
// -- MODELS
rootModel(mongoose);

app.listen(PORT);
console.log(`Express server running at localhost:${PORT}`);

// -- CONTROLLERS
rootController(app, { urlencoded: urlencodedBodyParser, json: jsonBodyParser }, mediaUploader);

app.get('/', (req, res) => {
  res.send('<h3><center><code>node task manager</code></center></h3>')
})