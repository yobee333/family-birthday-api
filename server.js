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
app.get('/',(req, res)=>{
    db.collection('birthdays').find().toArray()
    .then(data => {
        res.render('index.ejs', { info: data })
    })
    .catch(error => console.error(error))
})

//add a new birthday
app.post('/addBirthday', (req, res) => {
    db.collection('birthdays').insertOne(
        {firstName: request.body.firtName, nickName: request.body.nickName, birthday: request.body.birthday})
        .then(res => {
            console.log('birthday added')
            res.redirect('/')

        })
        .catch(err => console.log(err))
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