const { create } = require('domain')
const express = require('express')

const mysql = require('mysql')

const app = express()
// const Datastore = require('nedb')

app.listen(3000, () => console.log('listening...'))
app.use(express.static('public'))
app.use(express.json({limit: '1mb'}))

// const database = new Datastore('database.db')
// database.loadDatabase();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'weather'
})

db.connect((err) => {
    if (err) throw err
    console.log('mysql connected')
})

app.get('/cities', (request, response) => {
    var tables = "SELECT TABLE_NAME FROM information_schema.tables WHERE TABLE_SCHEMA = 'weather'"
    // response.json(tables)

    let query = db.query(tables, (err, results) => {
        if (err) throw err
        console.log(results)
        response.json(results) 
        //instead of send yo ucan do response.json
    })
})

app.get('/api', (request, response) => {
    var tables = "SELECT * FROM information_schema.tables WHERE TABLE_SCHEMA = weather"
    // response.json(tables)

    let query = db.query(tables, (err, results) => {
        if (err) throw err
        console.log(results)
        response.json(results) 
        //instead of send yo ucan do response.json
    })
})

app.post('/api', (request, response) => {
    console.log("I got a request!")
    
    const data = request.body
    
    var city = request.body.location.split(' ').join('_')

    db.query(`DROP TABLE IF EXISTS weather.${city}`)

    var createTable = `CREATE TABLE IF NOT EXISTS ${city} (id int AUTO_INCREMENT, date VARCHAR(255), high int, low int, avg int, cloud int, PRIMARY KEY (id));`
    // condition text, description text,
    
    db.query(createTable, (err, result) => {
        if(err) throw err;
        console.log('table created')
    })
   
    console.log(`${data.day1.datetime}`)

    var insert = `INSERT INTO ${city} (date, high, low, avg, cloud) VALUES (
        ${data.day1.datetime}, ${data.day1.tempmax}, ${data.day1.tempmin}, ${data.day1.temp}, ${data.day1.cloudcover}),
        (${data.day2.datetime}, ${data.day2.tempmax}, ${data.day2.tempmin}, ${data.day2.temp}, ${data.day2.cloudcover}),
        (${data.day3.datetime}, ${data.day3.tempmax}, ${data.day3.tempmin}, ${data.day3.temp}, ${data.day3.cloudcover}),
        (${data.day4.datetime}, ${data.day4.tempmax}, ${data.day4.tempmin}, ${data.day4.temp}, ${data.day4.cloudcover}),
        (${data.day5.datetime}, ${data.day5.tempmax}, ${data.day5.tempmin}, ${data.day5.temp}, ${data.day5.cloudcover}
    )`    

    let query = db.query(insert, (err, result) => {
        if (err) throw err
        console.log(result)
    })

})