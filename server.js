const express = require('express')
const app = express()
require('dotenv').config()

const MongoClient = require('mongodb').MongoClient
const PORT = 2323


let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = "birthdays"

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`connected to ${dbName} database`)
        db = client.db(dbName)
    })
    .catch(err => {
        console.log(err)
    })

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', (req, res) => {
    res.render('index.ejs')
})

//home page with search options--name, nickname, month
app.get('/', async (req, res) => {
    const getBirthday = await db.collection('birthdays').find().toArray()
    res.render('index.ejs', { info: getBirthday })
})

//add new birthday
app.post('/addBirthday', (req, res) => {//whatever our action is the name of our route in the post
    db.collection('birthdays').insertOne({ firstName: request.body.firtName, nickName: request.body.nickName, birthday: request.body.birthday })//method allows us to insert document into todo. Need 2 properties: actual todo and whether or not it's completed. Get the information from the form from the request. This will make a todo property and value will come from the input on our form. Completed property will always be false. This is a promise.
        .then(res => {
            console.log('Birthday has been added')
            res.redirect('/')
        })
})


//This is the schema I need for each person
// let person = {
//     firstName: "firstName",
//     nickName: "nickName",
//     month: "month",
//     day: day
// }

app.listen(process.env.PORT || PORT, () => {
    console.log(`server is running on port ${PORT} hope you are having a good day!`)
})