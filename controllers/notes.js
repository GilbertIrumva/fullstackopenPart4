const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/', (request, response, next) => {
  Note.find({})
    .then((notes) => {
      response.json(notes)
    })
    .catch(next)
})

notesRouter.post('/', (request, response, next) => {
  const note = new Note(request.body)

  note
    .save()
    .then((savedNote) => {
      response.status(201).json(savedNote)
    })
    .catch(next)
})

module.exports = notesRouter
