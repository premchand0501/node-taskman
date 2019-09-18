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
    console.log(req.body, moment.now());
    if (req.body.password !== req.body.confirmPassword) {
      res.json({ status: 0, msg: 'Passwords don\'t match' });
    }
    else {
      const today = moment().startOf('day');
      userModel.findUserBy({ createdOn: { $gte: today, $lte: moment(today).startOf('day') } }, (err, data) => {
        // console.log("find user: ", data);
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
                  const time = moment().toString();
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
}