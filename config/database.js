module.exports = {
  // db: "mongodb://localhost:27017/task_manager",
  db: `mongodb://${process.env.MONGO_USER_NAME}:${process.env.MONGO_USER_PASS}@ds247078.mlab.com:47078/node_task_manager`,
  secret: "myscret"
}