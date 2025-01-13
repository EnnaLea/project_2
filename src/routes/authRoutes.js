import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'

const router = express.Router()

// register a new user endpoint /auth/register
router.post('/register', (req, res) => {
    //res.setHeader('Content-Type', 'application/json');
    const { username, password } = req.body
    console.log(username, password)
    // save username and irreversibly encrypted password

    //encrypt the password
    const hashedPassword = bcrypt.hashSync(password, 8)
    
    // save the user and the hashed password to the database
    try {
        const insertUser = db.prepare(`INSERT INTO users (username, password) VALUES(?, ?)`)
        const result = insertUser.run(username, hashedPassword)

        // add the first todo
        const defaultTodo = `Hello :) dd your first todo`
        const insertTodo = db.prepare(`INSERT INTO todos(user_id, task)
            VALUES(?, ?)`)
        insertTodo.run(result.lastInsertRowid, defaultTodo)

        // create a token
        const token = jwt.sign({id: result.lastInsertRowid}, process.env.JWT_SECRET, {expiresIn: '24h'})
        res.json({token})

    } catch (error) {
        console.log(error.message)
        res.sendStatus(503)
        
    }

    
    res.sendStatus(201)

})

router.post('/login', (req, res) => {
   // res.setHeader('Content-Type', 'application/json');
    // we get their email and we lood up the password associaeted with the email in the database

    const { username, password } = req.body

    try {
        const getUser = db.prepare('SELECT * FROM users WHERE username = ?')
        const user = getUser.get(username)

        // check if the user is present in the db
        if(!user){
            return res.status(404).send({message: "User not found"})
        }

        // we check if the password is correct
        const passworIsValid = bcrypt.compareSync(password, user.password)
        if(!passworIsValid){
            return res(401).send({message: "Invalid passoword"})
        }

        console.log(user)

        // successful authentication
        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '24h'})
        res.json({token})

        

    } catch (error) {
        console.log(error.message)
        res.sendStatus(503)
        
    }


    
})

export default router