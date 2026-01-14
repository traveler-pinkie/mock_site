const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
let ID

require('dotenv').config()


let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


//-----GET Operations-----//


app.get('/',async (request, response)=>{
    response.render('login.ejs', {})

})

app.get('/index',async (request, response)=>{
    const todoItems = await db.collection('todos').find({id : ID}).toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false, id : ID})
    response.render('index.ejs', {items: todoItems, left: itemsLeft})

})

app.get('/signup',async (request, response)=>{
    response.render('signup.ejs', {})
})

app.get('/login',async (request, response)=>{
    response.render('login.ejs', {})
})



//-----POST Operations-----//

app.post('/signup', async(request, response) => {
    ID = Math.floor(Math.random() * 1000000)
    db.collection('users').insertOne({id: ID, username: request.body.username, password: request.body.password})
    .then(result => {
        console.log('User Signed Up')
        response.redirect('/login')
    })
    .catch(error => console.error(error))
})

app.post('/login',async (request, response)=>{

    const user = await db.collection('users').findOne({username: request.body.username})
    ID = user ? user.id : null
    if(user && user.password === request.body.password){
        response.redirect('/index')
    }else{
        response.send('Invalid credentials')
    }
    

})

app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({id: ID, thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/index')
    })
    .catch(error => console.error(error))
})

app.post('/logout', (request, response) => {
    ID = null
    try{
        response.redirect('/')
    }catch(error){
        console.error(error)
    }
})


//-----PUT Operations-----//

app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({id: ID, thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({id: ID, thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

//-----DELETE Operations-----//

app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({id: ID, thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})