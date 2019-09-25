const taskModel = require('../model/taskListModel');
const moment = require('moment');
const limits = require('../config/limits');

module.exports = (app, bodyParser) => {
  app.post('/create-new-task', bodyParser.json, (req, res) => {
    const today = moment().startOf('day');
    if (req.body) {
      taskModel.allTaskListsBy({
        createdOn: {
          $gte: today,
          $lte: moment(today).endOf('day')
        }
      }, (err, data) => {
        if (err) {
          console.log(err);
        }
        else {
          if (data && data.length > limits.MAXIMUM_TASKLIST_LIMIT) {
            res.json({ status: 0, msg: 'Maximum task Lists already created for the day' });
          }
          else {
            const time = moment().format();
            const newTaskList = {
              subTaskName: req.body.subTaskName,
              subTaskDesc: req.body.subTaskDesc,
              status: req.body.status,
              startDate: moment(req.body.startDate),
              endDate: moment(req.body.endDate),
              priority: req.body.priority,
              assignee: req.body.assignee,
              taskBoardId: req.body.taskBoardId,
              createdOn: time,
              updatedOn: time,
            };
            taskModel.createNewTask(newTaskList, (err, data) => {
              if (err) {
                res.json({ status: 0, msg: 'Failed to create new task' });
              }
              else {
                res.json({ status: 1, msg: 'Successfully created new task', data });
              }
            })
          }
        }
      })
    }
    else {
      res.json({ status: 0, msg: 'Please provide valid data for task' });
    }
  });
  app.get('/task-list', (req, res) => {
    taskModel.allTaskListsBy({}, (err, data) => {
      if (err) {
        res.json({ status: 0, msg: 'Failed to get task Lists' });
      }
      else {
        res.json({ status: 1, msg: 'Success', count: data.length, data });
      }
    })
  });
  app.get('/task-list-by-user/:id', (req, res) => {
    console.log(req.params.id)
    taskModel.allTaskListsBy({ assigneeId: req.params.id }, (err, data) => {
      if (err) {
        res.json({ status: 0, msg: 'Failed to get task Lists' });
      }
      else {
        res.json({ status: 1, msg: 'Success', count: data.length, data });
      }
    })
  });
  app.get('/task-list-by-taskboard-id/:id', (req, res) => {
    console.log(req.params.id)
    taskModel.allTaskListsBy({ taskBoardId: req.params.id }, (err, data) => {
      if (err) {
        res.json({ status: 0, msg: 'Failed to get task Lists' });
      }
      else {
        res.json({ status: 1, msg: 'Success', count: data.length, data });
      }
    })
  });
  app.get('/task-details/:id', (req, res) => {
    console.log(req.params.id)
    taskModel.taskDetailsBy({ _id: req.params.id }, (err, data) => {
      if (err) {
        res.json({ status: 0, msg: 'Failed to get task details' });
      }
      else {
        res.json({ status: 1, msg: 'Success', data });
      }
    })
  });
  app.delete('/remove-task/:id', (req, res) => {
    console.log(req.params.id)
    taskModel.removeTaskListById({ _id: req.params.id }, (err) => {
      console.log(err);
      if (err) {
        res.json({ status: 0, msg: 'Failed to remove task' });
      }
      else {
        res.json({ status: 1, msg: 'Successfully removed' });
      }
    })
  });
  app.post('/update-task', bodyParser.json, (req, res) => {
    const {
      _id,
      subTaskName,
      subTaskDesc,
      status,
      startDate,
      endDate,
      priority,
      assignee,
      taskBoardId
    } = { ...req.body };

    let updateData = {};
    console.log(status);
    if (subTaskName != null) updateData.subTaskName = subTaskName;
    if (subTaskDesc != null) updateData.subTaskDesc = subTaskDesc;
    if (status != null) updateData.status = status;
    if (startDate != null) updateData.startDate = startDate;
    if (endDate != null) updateData.endDate = endDate;
    if (priority != null) updateData.priority = priority;
    if (assignee != null) updateData.assignee = assignee;
    if (taskBoardId != null) updateData.taskBoardId = taskBoardId;

    updateData.updatedOn = moment().format();
    console.log("updateData", updateData);
    taskModel.updateTaskListById({ _id }, updateData, {}, (err, data) => {
      if (err) {
        res.json({ status: 0, msg: 'Failed to update task' });
      }
      else {
        console.log(data);
        if (data.ok === 1) {
          taskModel.taskDetailsBy({ _id }, (err, data) => {
            console.log(data);
            if (err) {
              res.json({ status: 0, msg: 'Failed to retrive updated tasks, try reloading page' });
            }
            res.json({ status: 1, msg: 'Successfully updated', data });
          })
        }
      }
    })
  });
}