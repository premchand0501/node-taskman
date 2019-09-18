const taskBoardController = require('./taskBoardController');
const userController = require('./userController');
const taskListController = require('./taskListController');
module.exports = (app, bodyParser) => {
  taskBoardController(app, bodyParser);
  userController(app, bodyParser);
  taskListController(app, bodyParser);
}