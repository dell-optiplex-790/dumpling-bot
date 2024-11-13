(function(args, user) {
	str = args.slice(1).join(' ')
	cmd = args[0]
	if(cmd==='encode') {
		send('Encoded: '+btoa(str))
		return
	}
	if(cmd==='decode') {
		send('Decoded: '+atob(str))
		return
	}
	send('syntax: d!base64 [encode/decode] [string]')
})