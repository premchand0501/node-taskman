const taskMediaModel = require('../model/taskMediaModel');
const moment = require('moment');
const limits = require('../config/limits');
const fs = require('fs');
const path = require('path');

module.exports = (app, bodyParser, mediaUploader) => {
  app.post('/upload-media', mediaUploader.single('media'), (req, res, next) => {
    const file = req.file;
    console.log('\n\n', req.body._id, file);
    if (!file) {
      res.json({ status: 0, msg: 'Media file is required' });
    }
    else {
      file.taskId = req.body._id;
      file.uploadedOn = moment().format();
      file.path = file.path.substring(file.path.indexOf('/') + 1);
      taskMediaModel.createNewTaskMedia(file, (err, data) => {
        if (err) {
          res.json({ status: 0, msg: 'Failed to upload media.\n' + err })
        }
        res.json({ status: 1, msg: 'Media uploaded', data });
      })
    }
  });
  app.delete('/delete-media/:id', (req, res) => {
    taskMediaModel.taskMediaDetailsBy({ _id: req.params.id }, (err, data) => {
      if (err) {
        res.json({ status: 0, msg: 'Failed to delete media' });
      }
      else {
        console.log(path.dirname(require.main.filename) + '/public/' + data.path);
        fs.unlink(path.dirname(require.main.filename) + '/public/' + data.path, (err) => {
          if (err) {
            throw err;
          }
          taskMediaModel.removeTaskMediaById({ _id: req.params.id }, (err) => {
            if (err) {
              res.json({ status: 0, msg: 'Failed to delete media' });
            }
            else {
              res.json({ status: 1, msg: 'Media deleted' });
            }
          })
        })
      }
    })
  });
  app.get('/task-medias', (req, res) => {
    taskMediaModel.allTaskMediasBy({}, (err, data) => {
      if (err) {
        res.json({ status: 0, msg: 'Failed to get medias' });
      }
      else {
        res.json({ status: 1, msg: 'Success', count: data.length, data });
      }
    })
  })
  app.get('/task-medias/:taskId', (req, res) => {
    taskMediaModel.allTaskMediasBy({ taskId: req.params.taskId }, (err, data) => {
      if (err) {
        res.json({ status: 0, msg: 'Failed to get task medias' });
      }
      else {
        res.json({ status: 1, msg: 'Success', count: data.length, data });
      }
    })
  })
}