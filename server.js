const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const connectDB = require('./config/db')
const passport = require('passport')
const bodyParser = require('body-parser')
const routes = require('./routes/index')

connectDB()

const app = express()

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())
app.use(routes)
app.use(passport.initialize())
require('./config/passport')(passport)

// const PORT = process.env.PORT || 3000

// app.listen(PORT, console.log('Server running in ' + process.env.NODE_ENV + 'mode on port ' + PORT))

app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  })
// remove this part after use.
function task() {
    console.log("Server is active");
}

setInterval(task, 60000);

task();