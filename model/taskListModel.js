let mongoose, TaskListSchema, TaskListModel;

module.exports = (mongooseRef) => {
  mongoose = mongooseRef;
  TaskListSchema = mongoose.Schema({
    subTaskName: String,
    subTaskDesc: String,
    status: Boolean,
    startDate: String,
    endDate: String,
    priority: Number,
    assignee: {
      assigneeId: String,
      assigneeName: String,
      profileImage: String,
    },
    createdOn: String,
    updatedOn: String,
    taskBoardId: String,
  });
  TaskListModel = mongoose.model('TaskList', TaskListSchema);
}

module.exports.createNewTask = (data, callback) => {
  TaskListModel(data).save(callback);
}
module.exports.allTaskListsBy = (data, callback) => {
  TaskListModel.find(data, callback);
}
module.exports.removeTaskListById = (data, callback) => {
  TaskListModel.findOne(data).deleteOne(callback);
}
module.exports.taskDetailsBy = (data, callback) => {
  TaskListModel.findOne(data, callback);
}
module.exports.updateTaskListById = (conditions, data, options, callback) => {
  TaskListModel.update(conditions, data, options, callback);
}