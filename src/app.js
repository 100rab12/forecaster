const path = require('path')
const express = require('express')
const hbs = require('hbs')

// API's
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 8000


// Define paths for express config
const publicPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Handle bars 
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// To serve the static pages
app.use(express.static(publicPath))

app.get('', (req,res)=>{
    res.render('index', {
        title: 'Forecaster!',
        name: 'Saurabh Tiwari'
    })
})

app.get('/about', (req,res)=>{
    res.render('about', {
        title: 'About Page',
        name: 'Saurabh Tiwari'
    })
})

app.get('/help', (req,res)=>{
    res.render('help', {
        title: 'Help Page',
        message: 'Hey i am here to help you!',
        name: 'Saurabh Tiwari'
    })
})


// Getting the weather
app.get('/weather',(req,res)=>{
    if(!req.query.address){
        return res.send({
            error: 'No address?'
        })
    }
    geocode(req.query.address, (err,{ latitude, longitude, location } = {})=>{

        if(err) {
            return res.send({ err })
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if(error){
                return res.send({ error })
            }
            res.send({
                location,
                forecast: forecastData,
                address: req.query.address
            })
        })
    })
})

app.get('/help/*', (req,res) => {
    res.render('404', {
        error_message: 'Help article not found!',
        name: 'Saurabh Tiwari',
        title: '404 Page'
    })
})

// 404 Page
app.get('*', (req,res) => {
    res.render('404', {
        error_message: 'Page Not Found!',
        name: 'Saurabh Tiwari',
        title: '404 Page'
    })
})


app.listen(port, ()=>{
    console.log('Server is up on the port 8000.')
})