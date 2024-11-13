(function(args, user) {
	socket.send('/r ' + args.join(' '))
})