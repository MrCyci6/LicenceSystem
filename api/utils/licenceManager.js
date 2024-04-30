const fs = require('fs');

const config = require('../config.json');
const licences = require('../licences.json');

function generateRandomString() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function convertToISODate(value) {
    if(value == "lifetime") return "lifetime";
    let unit = value.split("").filter(c => { return isNaN(c) }).join("");
    let amount = parseInt(value);

    let date = new Date();
    switch(unit) {
        case 'min':
            date.setMinutes(date.getMinutes() + amount);
            break;
        case 'hour':
            date.setHours(date.getHours() + amount);
            break;
        case 'day':
            date.setDate(date.getDate() + amount);
            break;
        case 'month':
            date.setMonth(date.getMonth() + amount);
            break;
        case 'year':
            date.setFullYear(date.getFullYear() + amount);
            break;
        default:
            return null;
    }

    return date.toISOString();
}

module.exports = {
	getLicenceInfo(licence) {
		for(let name in licences) {
			if(name == licence) return {status: 200, message: `Informations sur ${licence}`, data: licences[name]};
		}
		return {status: 204, message: `La licence spécifiée n'existe pas`};
	},

	generateUniqueLicence(plan) {
	    while (true) {
	        let generatedLicense = "ktool-" + generateRandomString();
	        if (this.getLicenceInfo(generatedLicense).status == 204) {
	       		
	       		let expireDate = "";  
	        	if(plan == "lifetime") {
	        		expireDate = convertToISODate("99year");
	        	} else if(/^\d+(min|hour|day|month|year)$/.test(plan)) {
	        		expireDate = convertToISODate(plan);
	        	} else {
	        		expireDate = convertToISODate("1day")
	        	}
	        	
	        	let currentDate = new Date();
	        	let data = {
	        		hwid: null,
	        		expire: expireDate,
	        		since: currentDate
	        	}

	        	licences[generatedLicense] = data;
	        	try {
	        		let newLicences = JSON.stringify(licences, null, 2);
	        		fs.writeFileSync('./licences.json', newLicences);
	            	return {status: 200, message: `Lice bien générée: ${generatedLicense}`, plan: data};
	        	} catch (e) {
	        		console.log(`[ERROR] - ${e}`)
	        		return {status: 500, message: `Erreur lors de l'ajout de la licence`}
	        	}
	        }
	    }
	},

	claimLicence(licence, hwid) {
		let licenceInfo = this.getLicenceInfo(licence);
		if(licenceInfo.status == 200) {
			if(licenceInfo.data.hwid) {
				return {status: 208, message: `Licence déjà utilisée`}
			} else {
				licences[licence].hwid = hwid;
	    		let newLicences = JSON.stringify(licences, null, 2);
	    		fs.writeFileSync('./licences.json', newLicences);
	        	return {status: 200, message: `Votre licence à bien été activée`, data: JSON.parse(newLicences)[licence]};
			}
		} else {
			return {status: 204, message: `La licence spécifiée n'existe pas`};
		}
	},

	deleteLicence(licence) {
		if(licences.hasOwnProperty(licence)) {
			delete licences[licence];
			let newLicences = JSON.stringify(licences, null, 2);
	    	fs.writeFileSync('./licences.json', newLicences);
		}
		return {status: 200, message: `Licence ${licence} deleted`}
	},

	licenceIsActivate(licence, hwid) {
		for(let name in licences) {
			if(name == licence) {
				if(licences[name].hwid == null) {
					return {status: 201, message: `Licence non activée`};
				} else if(licences[name].hwid == hwid) {
					return {status: 200, message: `Licence valide`};
				} else {
					return {status: 203, message: `Licence invalide`};
				}
			}
		}
		return {status: 204, message: `La licence spécifiée n'existe pas`};
	}
}