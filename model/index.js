const taskBoardModel = require('./taskBoardModel');
const userModel = require('./userModel');
const taskListModel = require('./taskListModel');
const taskMediaModel = require('./taskMediaModel');

module.exports = (mongooseRef) => {
  taskBoardModel(mongooseRef);
  userModel(mongooseRef);
  taskListModel(mongooseRef);
  taskMediaModel(mongooseRef);
}