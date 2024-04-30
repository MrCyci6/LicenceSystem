const express = require('express');
const fs = require('fs');
const fileUpload = require('express-fileupload');

const config = require('./config.json');
const licences = require('./licences.json');
const utils = require('./utils/licenceManager');

const app = express();
app.use(fileUpload());
const http = require('http').Server(app);

try {
	loadRoutes()
	main()
} catch (e) {
	console.log(`[ERROR] - ${e}`)
}

function main() {
	let port = config.port
	http.listen(port)
	
	console.log(`[LOG] - API enabled on http://${config.url}:${config.port}/`)

	setInterval(() => {
		for(let licence in licences) {
			licences[licence];
            let currentDate = new Date();
            let expireDate = new Date(licences[licence].expire);

            if(currentDate > expireDate) {
            	utils.deleteLicence(licence);
            	console.log(`[LOG] - La licence ${licence} a expirée.`);
            }
		}

    }, 5000);
}

function loadRoutes() {
	fs.readdirSync("./routes").forEach(file => {
		
		if(!file.endsWith('.js')) return   
	    
	    app.use('/', require(`./routes/${file}`))     
	    console.log(`[LOG] - route : ${file}`)
	})
	console.log(`[LOG] - Toutes les routes ont été chargées avec succès.`)
}