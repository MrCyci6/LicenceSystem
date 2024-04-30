const express = require('express');
const router = express.Router();
const fs = require('fs');

const config = require('../config.json');

router.get('/download/:depend', (req, res) => {
	let file = req.params.depend;
	
	if(!file) {
		return res.send(204).json({status: 204, message: `Requête incomplête`});
	}
	
	let filePath = `dependencies/${file}`;

    fs.access(filePath, fs.constants.F_OK, (err) => {
        console.log(err)
        if (err) {
            res.status(404).json({status: 404, message: 'Fichier non trouvé'});
            return;
        }

        res.setHeader('Content-disposition', `attachment; filename=${file}`);
        res.setHeader('Content-type', 'text/plain');

        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    });
});

module.exports = router;