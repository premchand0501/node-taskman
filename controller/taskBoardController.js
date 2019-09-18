const taskModel = require('../model/taskBoardModel');
const moment = require('moment');
const limits = require('../config/limits');
console.log(limits);
module.exports = (app, bodyParser) => {
  app.post('/create-new-board', bodyParser.json, (req, res) => {
    const today = moment().startOf('day');
    if (req.body) {
      taskModel.allTaskBoardsBy({
        createdOn: {
          $gte: today,
          $lte: moment(today).endOf('day')
        }
      }, (err, data) => {
        if (err) {
          console.log(err);
        }
        else {
          if (data && data.length > limits.MAXIMUM_TASKBOARD_LIMIT) {
            res.json({ status: 0, msg: 'Maximum task boards already created for the day' });
          }
          else {
            const time = moment().format();
            const newTaskBoard = {
              taskName: req.body.taskName,
              startDate: req.body.startDate,
              endDate: req.body.endDate,
              creatorId: req.body.creatorId,
              createdOn: time,
              updatedOn: time,
            };
            taskModel.createNewBoard(newTaskBoard, (err, data) => {
              if (err) {
                res.json({ status: 0, msg: 'Failed to create new board' });
              }
              else {
                res.json({ status: 1, msg: 'Successfully created new task board', data });
              }
            })
          }
        }
      })
    }
    else {
      res.json({ status: 0, msg: 'Please provide valid data for task board' });
    }
  });
  app.get('/task-boards', (req, res) => {
    if (req.body) {
      taskModel.allTaskBoardsBy({}, (err, data) => {
        if (err) {
          res.json({ status: 0, msg: 'Failed to get task boards' });
        }
        else {
          res.json({ status: 1, msg: 'Success', count: data.length, data });
        }
      })
    }
    else {
      res.json({ status: 0, msg: 'Failed to get task boards' });
    }
  });
  app.delete('/delete-task-board/:id', (req, res) => {
    taskModel.removeTaskBoardById({ _id: req.params.id }, (err) => {
      console.log(err);
      if (err) {
        res.json({ status: 0, msg: 'Failed to remove task board' });
      }
      else {
        res.json({ status: 1, msg: 'Successfully removed' });
      }
    })
  })
  app.get('/get-task-board-by-id/:id', (req, res) => {
    taskModel.taskBoardDetailsBy({ _id: req.params.id }, (err, data) => {
      console.log(err);
      if (err) {
        res.json({ status: 0, msg: 'Failed to get task board' });
      }
      else {
        res.json({ status: 1, msg: 'Success', data });
      }
    })
  })
}