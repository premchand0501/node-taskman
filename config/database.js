module.exports = {
  // db: "mongodb://localhost:27017/task_manager",
  db: `mongodb+srv://${process.env.MONGO_USER_NAME}:${process.env.MONGO_USER_PASS}@cluster0-dydth.mongodb.net/task_manager?retryWrites=true&w=majority&authSource=admin`,
  secret: "myscret"
}