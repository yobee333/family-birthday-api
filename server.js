const express = require('express')
const app = express()
require('dotenv').config()
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const ObjectId = mongodb.ObjectId // this is for formatting the _id ObjectId on each MongoDB document
const PORT = process.env.PORT || 3000


app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))//handle nested data coming thru the query string
app.use(express.json())

//MongoDB
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

//Auth0
const { auth, requiresAuth } = require('express-openid-connect');



app.use(
    auth({
        authRequired: false,
        auth0Logout: true,
        issuerBaseURL: process.env.ISSUER_BASE_URL,
        baseURL: process.env.BASE_URL,
        clientID: process.env.CLIENT_ID,
        secret: process.env.SECRET,
        idpLogout: true,
        domain: process.env.DOMAIN,
    })
);

app.get('/', (req,res) =>{
    if(req.oidc.isAuthenticated()){
        return res.redirect('/birthdayPage')
    }
    res.render('landingpage.ejs')
})

app.use(requiresAuth())


app.get('/birthdayPage', (req, res) => {
    const isAuthenticated = req.oidc.isAuthenticated();
    console.log("check if user is authenticated: ", isAuthenticated)
    if(!isAuthenticated){
        return res.redirect('/login');
    }
    res.render('index.ejs', { info: [], isAuthenticated })
})

app.get('/login', (req, res) => {
    console.log("check if user is authenticated: ", req.oidc.isAuthenticated())
    if(req.oidc.isAuthenticated()){
        return res.redirect('/birthdayPage')
    }
    
});

app.get('/profile', (req, res) => {
    res.send(JSON.stringify(req.oidc.user))
})

app.get('/logout', (req, res) => {
    if(!isAuthenticated){
        return res.redirect('/test');
    }
    res.render('landingpage.ejs', { info: [], isAuthenticated })
})

//sort birthdays by month to get all birthdays in that month

app.get('/filterBirthdays', async (req, res) => {
    const user_id = req.oidc.user.sub;
    const month = req.query.month
    const getBirthday = await db.collection('birthdays').find({
        $and: [
            { month },
            { user_id }
        ]
    }).toArray()
    res.render('index.ejs', { info: getBirthday })
})

// find by all names
app.get('/filterByName', async (req, res) => {
    const { searchTerm } = req.query;
    const regex = new RegExp(searchTerm, 'gi');
    const matches = await db.collection('birthdays').find({
        $and: [
            {
                $or: [
                    { firstName: regex },
                    { nickName: regex }]
            },
            { user_id: req.oidc.user.sub }
        ]
    }).sort({ firstName: 1 }).toArray();
    res.render('index.ejs', { info: matches })
})


//add new birthday
//This is the schema I need for each person
// let person = {
//     firstName: "firstName",
//     nickName: "nickName",
//     month: "month",
//     day: day
// }


app.get('/birthdayForm', (req, res) => {
    res.render('addbirthday.ejs')
})

app.post('/addBirthday', async (req, res) => {
    const birthday = await db.collection('birthdays').insertOne({
        user_id: req.oidc.user.sub,
        firstName: req.body.firstName,
        nickName: req.body.nickName,
        month: req.body.month,
        day: req.body.date
    })

    console.log('Birthday has been added')
    res.render('index.ejs', { info: [] })
})

//Delete birthday

app.delete('/deleteBirthday', async (req, res) => {
    const id = req.body.id
    console.log("id prop from req obj: ", id)
    const birthday = await db.collection('birthdays').deleteOne({
        "_id": new ObjectId(id)
    })
    console.log('Birthday has been deleted')
    res.json({ message: "successfully deleted" })
})

app.listen(process.env.PORT || PORT, () => {
    console.log(`server is running on port ${PORT} hope you are having a good day!`)
})