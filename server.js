const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = 5000
const {MONGOURI} = require('./keys')

require('./models/user')
require('./models/hotels')

app.use(express.json())


app.use(require('./routes/user'))
app.use(require('./routes/hotels'))


mongoose.connect(MONGOURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: false
})

mongoose.connection.on('connected', () => {
	console.log('connected to database')
})

mongoose.connection.on('error', (err) => {
	console.log('Err connecting', err)
})

app.listen(PORT, () =>{
	console.log('Server is running on', PORT)
})
