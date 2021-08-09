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
    res.render('index.ejs', {info: []})
})
async function createSearchOptions(userId, options = {}){
    const results = await db.collection('birthdays').find({$where: { userId }, ...options}).toArray()
    return results;
}

//home page with search options--name, nickname, month

app.get('/', authenticationMiddleware, async (req, res) => {
    const { userId } = req.user;
    const getBirthday = await db.collection('birthdays').find({$where: { userId }}).toArray()
    res.render('index.ejs', { info: getBirthday })
})

//sort birthdays by month to get all birthdays in that month

app.get('/filterBirthdays', async (req, res) => {
    const month = req.query.month
    const getBirthday = await db.collection('birthdays').find({month}).toArray()
    console.log("get Birthday", getBirthday)
    res.render('index.ejs', { info: getBirthday })
})

// find by all names
app.get('/filterByName', async( req, res )=>{
    const { searchTerm } = req.query;
    const regex = new RegExp(searchTerm, 'gi');
    const matches = await db.collection('birthdays').find(
        {
        $or: [
                { firstName: regex }, 
                { nickName: regex }
            ]
        }
    ).toArray();
    res.render('index.ejs', { info: matches })
})

//find birthday by name
app.get('/filterFirstName', async (req, res) => {
    const firstName = req.query.firstName
    const getBirthday = await db.collection('birthdays').find({firstName}).toArray()
    console.log("get Birthday", getBirthday)
    res.render('index.ejs', { info: getBirthday })
})


//find birthday by nickname
app.get('/filterNickName', async (req, res) => {
    const nickName = req.query.nickName
    const getBirthday = await db.collection('birthdays').find({nickName}).toArray()
    console.log("get Birthday", getBirthday)
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

// app.post('/addBirthday', (req, response) => {
//     db.collection('birthdays').insertOne({ firstName: req.body.firstName, nickName: req.body.nickName, month: req.body.month, day: req.body.date })
//         .then(res => {
//             console.log('Birthday has been added')
//             response.redirect('/')
//         })
// })

app.get('/birthdayForm', (req, res) => {
    res.render('addbirthday.ejs')
})

app.post('/addBirthday', async (req, res) => {
    const birthday = await db.collection('birthdays').insertOne({ 
        firstName: req.body.firstName, 
        nickName: req.body.nickName, 
        month: req.body.month, 
        day: req.body.date
    })
        
            console.log('Birthday has been added')
            res.render('index.ejs', {info: []})
        })


app.listen(process.env.PORT || PORT, () => {
    console.log(`server is running on port ${PORT} hope you are having a good day!`)
})