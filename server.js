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

app.get('/filterBirthdays', async (req, res) => {
    const month = req.query.month
    const getBirthday = await db.collection('birthdays').find({month}).toArray()
    console.log(getBirthday)
    res.render('index.ejs', { info: getBirthday })
})


app.get('/', async (req, res) => {
    const getBirthday = await db.collection('birthdays').find().toArray()
    res.render('index.ejs', { info: getBirthday })
})

//add new birthday
//This is the schema I need for each person
// let person = {
//     firstName: "firstName",
//     nickName: "nickName",
//     month: "month",
//     day: day
// }


app.post('/addBirthday', (req, response) => {
    db.collection('birthdays').insertOne({ firstName: req.body.firstName, nickName: req.body.nickName, month: req.body.month, day: req.body.date })
        .then(res => {
            console.log('Birthday has been added')
            response.redirect('/')
        })
})




app.listen(process.env.PORT || PORT, () => {
    console.log(`server is running on port ${PORT} hope you are having a good day!`)
})