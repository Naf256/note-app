const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors())
morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))



let notes = [
    {
        id: 1,
        content: "HTML is easy",
        date: "2022-05-30T17:30:31.098Z",
        important: true
    },
    {
        id: 2,
        content:"Browser can execute only Javascript",
        date: "2022-05-30T18:39:34.091Z",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the important methods of http protocol",
        date:"2022-05-30T19:20:14.298Z",
        important: true
    }
]

const generateId = () => {
    const maxId = notes.length > 0 
    ? Math.max(...notes.map(n => n.id))
    : 0

    return maxId + 1
}


app.post('/api/notes', (request, response) => {
    const body = request.body

    if (!body.content) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const note = {
        content: body.content,
        date: new Date(),
        important: body.important || false,
        id: generateId()
    }

    notes = notes.concat(note)

    response.json(note)
})


app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
    response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => {
        console.log(note.id, typeof note.id, id, typeof id, note.id === id)
        return note.id === id
    })

    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }
})

app.put('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const newNotes = notes.filter(note => note.id !== id)
    notes = newNotes.concat(request.body)
    response.json(request.body)
})

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)

    console.log(notes)
    response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})
