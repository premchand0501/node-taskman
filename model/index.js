const taskBoardModel = require('./taskBoardModel');
const userModel = require('./userModel');
const taskListModel = require('./taskListModel');

module.exports = (mongooseRef) => {
  taskBoardModel(mongooseRef);
  userModel(mongooseRef);
  taskListModel(mongooseRef);
}