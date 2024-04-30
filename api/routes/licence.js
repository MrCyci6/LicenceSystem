const express = require('express');
const router = express.Router();

const config = require('../config.json');
const utils = require('../utils/licenceManager')

router.get('/licence/admin/generate/:password/:time', (req, res) => {
	let password = req.params.password;
	let time = req.params.time;
	if(!password && !time) {
		return res.send(204).json({status: 204, message: `Requête incomplête`});
	}

	if(password == config.password) {
		return res.json(utils.generateUniqueLicence(time));
	} else {
		res.status(403).json({status: 403, message: `Accès interdit`});
	}
});

router.get('/licence/admin/delete/:password/:licence', (req, res) => {
	let password = req.params.password;
	let licence = req.params.licence;
	if(!password && !licence) {
		return res.send(204).json({status: 204, message: `Requête incomplête`});
	}

	if(password == config.password) {
		return res.json(utils.deleteLicence(licence));
	} else {
		res.status(403).json({status: 403, message: `Accès interdit`});
	}
});

router.get('/licence/admin/info/:password/:code', (req, res) => {
	let password = req.params.password;
	let licence = req.params.code;
	if(!password && !licence) {
		return res.send(204).json({status: 204, message: `Requête incomplête`});
	}

	if(password == config.password) {
		return res.json(utils.getLicenceInfo(licence))
	} else {
		res.status(403).json({status: 403, message: `Accès interdit`});
	}
});

module.exports = router;