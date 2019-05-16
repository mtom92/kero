// Required models
let express = require('express')

// router instances
let router = express.Router()

// include models
let db = require('../models')

// get tasks
router.get('/', (req, res) => {
  db.Task.find({
    sprint: req.params.id
  })
  .then(foundTasks => {
    res.send(foundTasks)
  })
  .catch( err => {
    console.log('error in get /tasks', err);
    res.status(500).send('Something went wrong. Contact administrator')
  })
})

//get tasks/:id
router.post('/get/:id', (req, res) => {
  db.Task.findById(req.params.id)
  .then(foundTask => {
    res.send(foundTask)
  })
  .catch( err => {
    console.log('error in get /task/:id', err);
    res.status(500).send('Something went wrong. Contact administrator')
  })
})


//post tasks
router.post('/post', (req, res) => {

  console.log('In the POST /sprint/ route');
  console.log(req.body);
  if(req.body.status === ''){
      req.body.status = 'todo'
  }
  db.Task.create(req.body)
  .then(createdTask => {
    res.send(createdTask)
  })
  .catch( err => {
    console.log('error in post /Projects', err);
    res.status(500).send('Something went wrong. Contact administrator')
  })

})


//put tasks //DONE
router.put('/:id', (req, res) => {
  //args : {where}, data , {options}
  db.Task.findOneAndUpdate(
    { _id: req.params.id},
    req.body,
    {new: true, useFindAndModify:false }) //this will return what was updated
  .then(editedTask => {
    console.log(editedTask);
    res.send(editedTask)
  })
  .catch( err => {
    console.log('error in PUT /task/:id', err);
    res.status(500).send('Something went wrong. Contact administrator')
  })
})

//delete tasks
router.delete('/:id', (req, res) => {
  db.Task.findOneAndDelete(
    {_id: req.params.id},
    {useFindAndModify: false}
  )
  .then(() => {
    res.status(204).send()
  })
  .catch( err => {
    console.log('error in delete /tasks/:id', err);
    res.status(500).send('Something went wrong. Contact administrator')
  })
})
module.exports = router
