let mongoose, TaskBoardSchema, TaskBoardModel;

module.exports = (mongooseRef) => {
  mongoose = mongooseRef;
  TaskBoardSchema = mongoose.Schema({
    taskName: String,
    taskDesc: String,
    startDate: String,
    endDate: String,
    creatorId: String,
    createdOn: String,
    updatedOn: String,
  });
  TaskBoardModel = mongoose.model('TaskBoard', TaskBoardSchema);
}

module.exports.createNewBoard = (data, callback) => {
  TaskBoardModel(data).save(callback);
}
module.exports.allTaskBoardsBy = (data, callback) => {
  TaskBoardModel.find(data, callback);
}
module.exports.taskBoardDetailsBy = (data, callback) => {
  TaskBoardModel.findOne(data, callback);
}
module.exports.removeTaskBoardById = (data, callback) => {
  TaskBoardModel.find(data).deleteOne(callback);
}
module.exports.updateTaskBoardById = (conditions, data, options, callback) => {
  TaskBoardModel.updateOne(conditions, data, options, callback);
}