const bcrypt = require('bcryptjs');
let mongoose, UserSchema, UserModel;

module.exports = (mongooseRef) => {
  mongoose = mongooseRef;
  UserSchema = mongoose.Schema({
    name: String,
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: String,
    createdOn: String,
    updatedOn: String,
  });
  UserModel = mongoose.model('Users', UserSchema);
}

module.exports.findAllUsers = (callback) => {
  UserModel.find({}, callback);
}

module.exports.findUserBy = (data, callback) => {
  UserModel.find(data, callback);
}

module.exports.findUserById = (data, callback) => {
  UserModel.findOne(data, callback);
}

module.exports.comparePassword = (passwordToCompare, hash, callback) => {
  bcrypt.compare(passwordToCompare, hash, callback);
}
module.exports.removeUserById = (data, callback) => {
  UserModel.find(data).deleteOne(callback);
}
module.exports.updateProfile = (conditions, data, options, callback) => {
  UserModel.updateOne(conditions, data, options, callback);
}
module.exports.addUser = (data, callback) => {
  const newUser = new UserModel({
    name: data.name,
    email: data.email,
    password: data.password,
    profileImage: data.profileImage,
    createdOn: data.createdOn,
    updatedOn: data.updatedOn,
  })
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      throw err;
    }
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) {
        throw err;
      }
      newUser.password = hash;
      newUser.save(callback);
    })
  })
}