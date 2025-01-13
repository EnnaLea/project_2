import express from 'express'
import path, {dirname} from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/authRoutes.js'
import todoRoutes from './routes/todoRoutes.js'

const app = express()
const PORT = process.env.PORT || 5000

// GET the file path from the URL of the current module
const __filename = fileURLToPath(import.meta.url)

// GET dirname from the file path
const __dirname = dirname(__filename)


// Middleware

// reciving json information
app.use(express.json())

// serve html file form the  /public directory
// tells express to serve all files from the public folder as static assets
// any request for the css file will be resolved to the public directory.
app.use(express.static(path.join(__dirname, '../public')))


// serving the html file from the public folder
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// routes
app.use('/auth', authRoutes)
app.use('/todos', todoRoutes)



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})