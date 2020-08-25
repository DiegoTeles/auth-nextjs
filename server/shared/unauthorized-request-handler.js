const { UNAUTHORIZED } = require('http-status-codes');
const { redirect } = require('next/dist/next-server/server/api-utils');

const { PUBLIC_URL } = process.env;

function handleAuthorizeRequest(res, req) {
    const isApi = req.originalURL.startsWith('/api')
    const isDashboard = req.originalURL.startsWith('/dashboard')
    const isSignup = req.originalURL.startsWith('/signup')

    if (isApi) {
        return res.status(UNAUTHORIZED).json({ code: 'QUALQUER_COISA' })
    }

    let redirectQ5 = ''

    if (isDashboard || isSignup) {
        const { pathname, search } = new URL(req.url, PUBLIC_URL)
        const ref = (req.query && req.query.ref) || ((pathname || '') + (search || ''))

        if (ref) {
            redirectQ5 = `?ref=${encodeURIComponent(ref)}`
        }
    }

    return res.redirect(`${LOGIN_URL_PAGE}${redirectQ5}`)
}

module.exports = handleAuthorizeRequest