const taskBoardController = require('./taskBoardController');
const userController = require('./userController');
const taskListController = require('./taskListController');
const taskMediaController = require('./taskMediaController');

module.exports = (app, bodyParser, mediaUploader) => {
  taskBoardController(app, bodyParser);
  userController(app, bodyParser);
  taskListController(app, bodyParser);
  taskMediaController(app, bodyParser, mediaUploader);
}