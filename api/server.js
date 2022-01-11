// BUILD YOUR SERVER HERE
const express = require('express');
const Users = require('./users/model.js');


const server = express();//instance of express

//global middleware
server.use(express.json());// allows server to parse through json useng express built in method

//Building endpoints from here on out
//POST -- /api/users -- creates user with info inside the request body
server.post('/api/users', async (req, res)=> {
    try {
        if(!req.body.name || !req.body.bio){
            res.status(400).json({message: "Please provide name and bio for the user"})
        }else{
        const newUser = await Users.insert(req.body);
        res.status(201).json(newUser)
        }
    } catch(err){
        res.status(500).json({
            message: "error adding user",
            error: err.message,
        })
    }
})


//GET -- /api/users -- returns array of users
server.get('/api/users',  (req, res) => {
    Users.find()
    .then( allUsers => {
        res.status(200).json(allUsers)
    })
    .catch(err => {
        res.status(500).json({ message: "The users information could not be retrieved" ,
            error: err.message //what you use for developing mode - get the real error
        })
   })
})


//GET -- /api/users/:id -- returns the user object with the specific id
server.get('/api/users/:id', async (req, res) => {
    try {
        const users = await Users.findById(req.params.id);
        if(!users){
            res.status(404).json({message: "The user with the specified ID does not exist" })
        }else {
        res.status(200).json(users)
        }
        
    }
    catch(err) {
        res.status(500).json({
            message: "The user information could not be retrieved",
            error: err.message
        })
    }
})

//DELETE -- /api/users/:id -- removes the user with the specified id and returns the deleted user

server.delete('/api/users/:id', async (req, res) => {
    try {
        const users = await Users.remove(req.params.id);
        if(!users){
            res.status(404).json({message: "The user with the specified ID does not exist" })
        }else {
        res.status(200).json(users)
        }
        
    }
    catch(err) {
        res.status(500).json({
            message: "The user could not be removed",
            error: err.message
        })
    }
});

//PUT -- /api//users/:id -- updates the user with the specified id using data from the request body. Returns the modified user

server.put('/api/users/:id', (req, res) => {
    
    Users.update(req.params.id, req.body)
    .then(updatedUser => {
        if(!req.body.name || !req.body.bio){
            res.status(400).json({message:"Please provide name and bio for the user" })
        }else if(!updatedUser){
            res.status(404).json({
                message: "The user with the specified ID does not exist"
            })
        }else {
            res.status(200).json(updatedUser)
        }
    })
    .catch(err => {
        res.status(500).json({ message: "The users information could not be retrieved" ,
            error: err.message 
        })
   })
})


module.exports = server; // EXPORT YOUR SERVER instead of {}

