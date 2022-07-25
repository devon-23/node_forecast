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

app.get('/api', (request, response) => {
    db.find({}, (err, data) => {
        if (err) {
            response.end()
            return;
        }
        response.json(data)
    })
})

app.post('/api', (request, response) => {
    console.log("I got a request!")
    
    const data = request.body.day1
    
    let sql = 'INSERT INTO cities SET ?'
    let weather = {name: request.body.location, high: data.tempmax, low: data.tempmin, avg: data.temp}
    
    let query = db.query(sql, weather, (err, result) => {
        if (err) throw err
        console.log(result)
    })

})