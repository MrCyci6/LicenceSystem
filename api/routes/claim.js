const express = require('express');
const router = express.Router();

const config = require('../config.json');
const utils = require('../utils/licenceManager')

router.get('/licence/claim/:code/:hwid', (req, res) => {
	let licence = req.params.code;
	let hwid = req.params.hwid;

	if(!licence || !hwid) {
		return res.send(204).json({status: 204, message: `Requête incomplête`});
	}
	
	res.json(utils.claimLicence(licence, hwid));
});

module.exports = router;