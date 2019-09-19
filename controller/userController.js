const moment = require('moment');
const userModel = require('../model/userModel');
const userConfig = require('../config/limits');

module.exports = (app, bodyParser) => {
  app.post('/auth', bodyParser.urlencoded, (req, res) => {
    console.log(req.body);
    const email = req.body.email;
    const password = req.body.password;

    if (email !== '' && password !== '') {
      userModel.findUserByEmail({ email }, (err, data) => {
        console.log(data);
        if (err) {
          res.json({ status: 0, msg: 'User not found' });
        }
        else {
          userModel.comparePassword(password, data.password, (err, isMatched) => {
            console.log(err);
            if (err) {
              res.json({ status: 0, msg: 'Something went wrong' });
              return;
            }

            if (isMatched)
              res.json({ status: 1, msg: 'Success', data });
            else
              res.json({ status: 0, msg: 'Passwords don\'t match, please check your passwords.' });
          })
        }
      })
    }
  });
  app.get('/users', (req, res) => {
    userModel.findAllUsers((err, data) => {
      if (err) {
        res.json({ status: 0, msg: 'Failed to get users' });
      }
      else
        res.json({ status: 1, msg: 'Success', count: data.length, data });
    })
  });
  app.get('/users/:id', (req, res) => {
    userModel.findUserById({ _id: req.params.id }, (err, data) => {
      if (err) {
        res.json({ status: 0, msg: 'Failed to get users' });
      }
      else
        res.json({ status: 1, msg: 'Success', count: data.length, data });
    })
  });
  app.delete('/users/:id', (req, res) => {
    userModel.removeUserById({ _id: req.params.id }, (err, data) => {
      console.log("remove", data)
      if (err) {
        res.json({ status: 0, msg: 'Failed to remove user' });
      }
      else
        res.json({ status: 1, msg: 'Success' });
    })
  });
  app.post('/register', bodyParser.urlencoded, (req, res) => {
    console.log(req.body, moment().format());
    if (req.body.password !== req.body.confirmPassword) {
      res.json({ status: 0, msg: 'Passwords don\'t match' });
    }
    else {
      const today = moment().startOf('day');
      userModel.findUserBy({ createdOn: { $gte: today, $lte: moment(today).endOf('day') } }, (err, data) => {
        console.log("find user: ", data);
        if (err) {
          console.log(err);
        }
        else {
          if (data.length > userConfig.MAXIMUM_USERS_LIMIT) {
            res.json({ status: 0, msg: 'Maximum users already created for the day' });
          }
          else {
            userModel.findUserBy({ email: req.body.email }, (err, data) => {
              // console.log(req.body.email);
              if (err) {
                res.json({ status: 0, msg: 'Failed to register user' });
              }
              else {
                if (data && data.length > 0) {
                  res.json({ status: 0, msg: 'User already registered' });
                }
                else {
                  const time = moment().format();
                  const newUSer = {
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    profileImage: req.body.profileImage,
                    createdOn: time,
                    updatedOn: time,
                  };
                  userModel.addUser(newUSer, (err, data) => {
                    if (err) {
                      res.json({ status: 0, msg: 'Failed to register user' });
                    }
                    else {
                      res.json({ status: 1, msg: 'Success', data });
                    }
                  });
                }
              }
            })
          }
        }
      });
    }
  });
  app.post('/update-profile', bodyParser.urlencoded, (req, res) => {
    if (req.body) {
      const { _id, name, profileImage, password } = { ...req.body };
      let updateData = {};
      if (name) {
        updateData.name = name;
      }
      if (profileImage) {
        updateData.profileImage = profileImage;
      }
      if (password) {
        updateData.password = password;
      }
      updateData.updatedOn = moment().format();
      console.log(updateData);
      userModel.updateProfile({ _id }, updateData, null, (err, data) => {
        if (err) {
          res.json({ status: 0, msg: `Error occured while updating your profile: \n${err}` });
        }
        else {
          userModel.findUserById({ _id }, (err, data) => {
            if (err) {
              res.json({ status: 0, msg: 'Failed to get user details, try after sometime.' });
            }
            else
              res.json({ status: 1, msg: 'Success', data });
          })
        }
      })
    }
    else {
      res.json({ status: 0, msg: 'No update data provided' });
    }
  })
}