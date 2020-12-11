const { signup, login, logout } = require('./auth.controller')

module.exports = router => {
  router.post('/signup', signup)
  router.post('/login', login)
  router.get('/logout', logout)
}
