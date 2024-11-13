(function(args, user) {
	socket.send(`Hi ${user.nick}!\n${config.bot.name} - Help\n======================\n${getCommands().join('\n')}\n======================\nBot ID: ${botID}\nHosted on ${os.version()}.`)
})