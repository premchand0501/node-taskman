let mongoose, TaskMediaSchema, TaskMediaModel;

module.exports = (mongooseRef) => {
  mongoose = mongooseRef;
  TaskMediaSchema = mongoose.Schema({
    fieldname: String,
    originalname: String,
    encoding: String,
    mimetype: String,
    destination: String,
    filename: String,
    path: String,
    size: Number,
    taskId: String,
    uploadedOn: String,
  });
  TaskMediaModel = mongoose.model('TaskMedia', TaskMediaSchema);
}

module.exports.createNewTaskMedia = (data, callback) => {
  TaskMediaModel(data).save(callback);
}
module.exports.allTaskMediasBy = (data, callback) => {
  TaskMediaModel.find(data, callback);
}
module.exports.removeTaskMediaById = (data, callback) => {
  TaskMediaModel.findOne(data).deleteOne(callback);
}
module.exports.taskMediaDetailsBy = (data, callback) => {
  TaskMediaModel.findOne(data, callback);
}
module.exports.updateTaskMediaById = (conditions, data, options, callback) => {
  TaskMediaModel.updateOne(conditions, data, options, callback);
}