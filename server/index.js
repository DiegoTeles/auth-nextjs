const express = require('express')
const bodyParser = require('body-parser')
const { NO_CONTENT } = require('http-status-codes')
const favicon = require('serve-favicon')
const path = require('path')
const compression = require('compression')
const helmet = require('helmet')
const csp = require('helmet-csp')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')

const pkg = require('../package.json')

const apiRoutes = require('./api')
const { logout } = require('./api/auth/auth.controller')
const authentication = require('./middleware/authentication')
const requestId = require('./middleware/request-id')
const codeErrorHandler = require('./middleware/code-error-handler')
const tokenDecoder = require('./middleware/token-decoder')
const cacheManager = require('./middleware/cache-manager')

const dev = process.env.NODE_ENV !== 'production'
const server = express()
const port = parseInt(process.env.PORT, 10) || 3000

const morganFormat = ':req[x-forwarded-for] :remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - ID :res[x-request-id] - :response-time ms'

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

const removeTraillingSlash = (req, res, next) => {
    const test = /\?[^]*\//.test(req.url)
    if (req.url.substr(-1) === '/' && req.url.length > 1 && !test) {
        return res.redirect(301, req.url.slice(0, -1))
    }
    next()
}

server.set('trust proxy', 1)
server.enable('case sensitive routing')
server.enable('strict routing')
server.disable('x-powered-by')
server.use(requestId)
server.use(favicon(path.join(__dirname, '..', 'public', 'favicon.png')))
server.use(morgan(dev ? 'dev' : morganFormat))
server.use(removeTraillingSlash)
server.use(compression())
server.use(helmet({ referrerPolicy: { policy: 'no-referrer-when-downgrade' } }))
server.use(csp({
    directives: {
        frameAncestors: ["'self'"],
        reportUri: '/csp-violation',
    },
    reportOnly: false,
}))
server.use(cookieParser())
server.use(bodyParser.json({
    type: ['json', 'application/csp-report'],
    limit: '10mb',
}))
server.post('/csp-violation', (req, res) => {
    console.error('CSP Violation: ', req.body || 'No Data received')
    res.status(204).end()
})
server.use(tokenDecoder)
server.use(cacheManager)
server.use('/api', apiRoutes())
server.get('/logout', logout) // @TODO: Fix this?
server.use('/', express.static(path.resolve(__dirname, '..', 'public')))
server.post('/api/dashboard-error', authentication, (req, res) => {
    console.error('Dashboard App Error:')
    console.error('Customer: ', req.customer)
    console.error('Token: ', req.token)
    console.error('Message: ', req.body.message)
    console.error('Stack:\n', req.body.stack)
    console.error('Component Stack:\n', req.body.componentStack)
    res.sendStatus(NO_CONTENT)
})
server.use(codeErrorHandler())

module.exports = { server, listen }