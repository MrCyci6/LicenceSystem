const axios = require('axios');
const readline = require('readline-sync');

let color = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",

    fgBlack: "\x1b[30m",
    fgRed: "\x1b[31m",
    fgGreen: "\x1b[32m",
    fgYellow: "\x1b[33m",
    fgBlue: "\x1b[34m",
    fgMagenta: "\x1b[35m",
    fgCyan: "\x1b[36m",
    fgWhite: "\x1b[37m",
    fgGray: "\x1b[90m",

    bgBlack: "\x1b[40m",
    bgRed: "\x1b[41m",
    bgGreen: "\x1b[42m",
    bgYellow: "\x1b[43m",
    bgBlue: "\x1b[44m",
    bgMagenta: "\x1b[45m",
    bgCyan: "\x1b[46m",
    bgWhite: "\x1b[47m",
    bgGray: "\x1b[100m"
};


const banner = `██╗  ██╗████████╗ ██████╗  ██████╗ ██╗     
██║ ██╔╝╚══██╔══╝██╔═══██╗██╔═══██╗██║     
█████╔╝    ██║   ██║   ██║██║   ██║██║     
██╔═██╗    ██║   ██║   ██║██║   ██║██║     
██║  ██╗   ██║   ╚██████╔╝╚██████╔╝███████╗
╚═╝  ╚═╝   ╚═╝    ╚═════╝  ╚═════╝ ╚══════╝
Made by MrCyci6 | Version Admin\n`;

let baseUrl = "http://localhost:5000/licence/"
let password = "1234";

function main() {
	console.clear();
    console.log(banner);

    printHelp();
    let args = String(readline.question(`${color.fgGreen}root@ktool${color.fgWhite}:${color.fgCyan}~${color.fgWhite}# `)).split(" ");
    
    if(args.length < 2) {
    	main();
    }

    if(args[0].toLowerCase() == "generate") {
    	generateLicence(args[1]);
    } else if(args[0].toLowerCase() == "delete") {
    	deleteLicence(args[1]);
    } else if(args[0].toLowerCase() == "plan") {
    	getInfo(args[1]);
    } else {
    	main();
    }

}

function printHelp() {
	console.log(`+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
| generate [2min|2hour|2day|2month|2year|lifetime] - (Generate unique licence)  |
| delete [licence] - (Delete licence [*] irreversible [*])                      |
| plan [licence] - (View plan of licence)                                       |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+\n`)
}

async function generateLicence(time) {
	await axios.get(baseUrl + `admin/generate/${password}/${time}`, { timeout: 10000 }).then(resp => {
		console.log(`[ACTION] - Generate`)
		console.log(`[STATUS] - ${resp.data.status}`)
		console.log(`[MESSAGE] - ${resp.data.message}`)
		if(resp.data.status == 200) {
			console.log(`[DATA]
[HWID] - ${resp.data.plan.hwid}
[SINCE] - ${resp.data.plan.since}
[EXPIRE] - ${resp.data.plan.expire}`)
		}

		String(readline.question(`Back to the menu...`));
		main();
	}).catch(e => {
		console.log(`[ERROR] - ${e}`)

		String(readline.question(`Retry ...`));
		generateLicence(time);
	})
}

async function deleteLicence(licence) {
	await axios.get(baseUrl + `admin/delete/${password}/${licence}`, { timeout: 10000 }).then(resp => {
		console.log(`[ACTION] - Delete`)
		console.log(`[STATUS] - ${resp.data.status}`)
		console.log(`[MESSAGE] - ${resp.data.message}`)

		String(readline.question(`Back to the menu...`));
		main();
	}).catch(e => {
		console.log(`[ERROR] - ${e}`)

		String(readline.question(`Retry ...`));
		deleteLicence(licence);
	});
}

async function getInfo(licence) {
	await axios(baseUrl + `admin/info/${password}/${licence}`, { timeout: 10000 }).then(resp => {
		console.log(`[ACTION] - Info`)
		console.log(`[STATUS] - ${resp.data.status}`)
		console.log(`[MESSAGE] - ${resp.data.message}`)
		if(resp.data.status == 200) {
			console.log(`[DATA]
[HWID] - ${resp.data.data.hwid}
[SINCE] - ${resp.data.data.since}
[EXPIRE] - ${resp.data.data.expire}`)
		}

		String(readline.question(`Back to the menu...`));
		main();
	}).catch(e => {
		console.log(`[ERROR] - ${e}`)

		String(readline.question(`Retry ...`));
		getInfo(licence);
	});
}

main();