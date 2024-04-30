const express = require('express');
const router = express.Router();

const config = require('../config.json');
const utils = require('../utils/licenceManager')

router.get('/licence/client/:licence/:hwid', (req, res) => {
	let licence = req.params.licence;
	let hwid = req.params.hwid;
	if(!licence && !hwid) {
		return res.send(204).json({status: 204, message: `Requête incomplête`});
	}

	return res.json(utils.licenceIsActivate(licence, hwid));
});

module.exports = router;