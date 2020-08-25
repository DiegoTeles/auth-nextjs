const next = require('next');

const { server, listen } = require('./server');
const authentication = require('./server/middleware/authentication');
const singupStatusValidator = require('./server/middleware/signup-status-validator')

const dev = NODE_ENV !== 'production';
const app = next({ dev, dir: 'src' })
const nextHandler = app.getRequestHandler();

app.prepare().then(() => {
    server.get('*', (req, res, _next) => {

        console.log('aqui :>> ');
        if (['/', 'signin'].includes(req.path)) {
            app.render(req, res, '/index', req.query)
            return
        }
        _next()
    })

    server.all(`/_next/${app.buildId}/pages/dashboard*`, authentication)
    server.get('*', nextHandler)

    listen()
})