if (window.ARGON) {
  var socket = io()

  socket.on('connect', function() {
    ARGON.emit('connect')
  })

  socket.on('toChannel', function(data) {
    ARGON.managerPort._emit(data.type, data.event)
  })

  ARGON.managerPort._eventInput.pipe( function(type, event) {
    socket.emit('fromChannel', {type:type, event:event})
  })
}
