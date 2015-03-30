var gulp = require('gulp')
var port = 1337
var express = require('express')

gulp.task('serve', function(cb) {
  var app = express()
  app.use(express.static('./'))
  app.listen(port, cb)
  console.log('Listening on port ' + port)
})
gulp.task('dev', ['serve'])

gulp.task('debug', function(cb) {
  var express = require('express')
  var app = express()
  var server = require('http').Server(app)
  var io = require('socket.io')(server)

  app.use(require('connect-inject')({
    snippet: [
      '<script src="/socket.io/socket.io.js"></script>',
      '<script src="/remoteDebug.js"></script>'
    ],
    ignore: ['debug.html', '.js', '.css', '.svg', '.ico', '.woff', '.png', '.jpg', '.jpeg']
  }))

  app.get('/', function (req, res, next) {
    var ua = req.headers['user-agent']
    if (ua.indexOf('Argon') != -1) res.redirect('/debug.html')
    else next()
  })

  app.use(express.static('./'))

  io.on('connection', function (socket) {
    socket.on('fromChannel', function (data) {
       socket.broadcast.emit('toRemoteChannelManager', data)
    })
    socket.on('fromRemoteChannelManager', function (data) {
      socket.broadcast.emit('toChannel', data)
    })
  })

  server.listen(port, cb)
  console.log('Listening on port ' + port)
})
