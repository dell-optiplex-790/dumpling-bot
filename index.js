var io = require("socket.io-client");
var os = require('os');
var he = require('he');
var crypto = require('crypto');
var fs = require('fs');
var config = {}
const { execSync } = require('child_process')
var socket = io("https://www.windows93.net:8086", {
	forceNew: true,
	transportOptions: {
		polling: {
			extraHeaders: {
				"Accept": "*/*",
				"Accept-Encoding": "identity",
				"Accept-Language": "*",
				"Cache-Control": "no-cache",
				"Connection": "keep-alive",
				"Cookie": "",
				"Host": "www.windows93.net",
				"Origin": "http://www.windows93.net",
				"Pragma": "no-cache",
				"Referer": 'http://www.windows93.net/trollbox/index.php',
				"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36"
			}
		}
	}
});


var UID = crypto.createHash('MD5').update(execSync('cmd /c curl https://api.ipify.org 2>NUL')).digest('hex') // get ip and hash synchronously - only works on windows
var botID = UID[0] + UID[4] + UID[5] + UID[2] + UID[7]

function reloadConfig(){
	config=JSON.parse(fs.readFileSync('config.json').toString());
	if(!config.nameLayout) {
		socket.emit('user joined', `${config.prefix}${config.bot.name}`, config.bot.color, '', '')
	} else {
		socket.emit('user joined', config.nameLayout.replaceAll('name', config.bot.name).replaceAll('prefix', config.prefix), config.bot.color, '', '')
	}
}
reloadConfig()


function getCommands() {
	return fs.readdirSync('commands').filter(j=>j.endsWith('.js')).map(e=>config.prefix+e.slice(0,-3))
}
function send(e) {
	socket.send('\u200B'.repeat(Math.round(Math.random() * 10)) + he.decode(e))
}
socket.on('message', (data) => {	
	if(data.msg.startsWith(config.prefix)) {
		var cmd = he.decode(data.msg).split(' ')[0].slice(config.prefix.length)
		if(fs.existsSync(`commands/${cmd}.js`)) {
			try {
				eval(fs.readFileSync(`commands/${cmd}.js`).toString())(he.decode(data.msg).split(' ').slice(1),{nick:he.decode(data.nick),color:he.decode(data.color),home:data.home})
			} catch(e) {
				send('Error ===========================\n' + e.toString())
			}
		} else {
			send(`Unknown command: ${cmd}`)
		}
	}
})