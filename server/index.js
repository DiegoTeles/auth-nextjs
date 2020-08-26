const express = require('express')
const bodyParser = require('body-parser')
const favicon = require('serve-favicon')
const path = require('path')
const compression = require('compression')
const helmet = require('helmet')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')

const apiRoutes = require('./api')

const pkg = require('../package.json')


const tokenDecoder = require('./middleware/token-decoder')

const server = express()
const port = parseInt(process.env.PORT, 10) || 3000


const listen = () => {
    server.listen(port, err => {
        if (err) throw err
        console.log('\n')
        console.log(new Array(30).join('★☆'))
        console.log(`»»» Auth Next v${pkg.version} FLAMEJANTE on port: ${port}`)
        console.log(new Array(30).join('★☆'))
        console.log('\n')
    })
}

server.set('trust proxy', 1)
server.use(favicon(path.join(__dirname, '..', 'public', 'favicon.png')))
server.use(morgan('dev'))
server.use(compression())
server.use(helmet())
server.set('etag', false);
server.use(cookieParser())
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({
  extended: false
}))

server.use(tokenDecoder)

server.use('/api', apiRoutes())


module.exports = { server, listen }