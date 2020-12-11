const next = require('next');

const { server, listen } = require('./server');
const authentication = require('./server/middleware/authentication');
const { NODE_ENV } = process.env;

const dev = NODE_ENV !== 'production';
const app = next({ dev, dir: 'src' })
const nextHandler = app.getRequestHandler();

app.prepare().then(() => {
    server.get('/login', (req, res) => {
        app.render(req, res, '/login', {
            ...req.query,
            ...req.params,
        })
    })

    server.get('/dashboard', authentication, (req, res) => {
        app.render(req, res, '/dashboard', {
            ...req.query,
            ...req.params,
        })
    })

    server.get('*', nextHandler)

    listen()
})