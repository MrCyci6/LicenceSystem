const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const fs = require('fs');

const config = require('../config.json');

router.post('/inject', (req, res) => {
	if (!req.files || !req.files.jarFile) {
        return res.status(204).json({status: 204, message: `Requête incomplête`});
    }

    let jarFile = req.files.jarFile;
    let fileName = jarFile.name;

    try {
        jarFile.mv(fileName, (e) => {
            if (e) {
                console.log("[INJECT ERROR] - " + e)
                return res.status(500).json({status: 500, message: `Error`});
            }

            exec(`java -jar KInjector.jar ${fileName}`, (e, stdout, stderr) => {
                if (e) {
                    console.log("[INJECT ERROR] - " + e)
                    return res.status(500).json({status: 500, message: `Error while injecting ${fileName}`});
                }
                if (stderr) {
                    console.log("[INJECT ERROR] - " + stderr)
                    return res.status(500).send(`Erreur lors de l'injection : ${stderr}`);
                }

                if(stdout.includes("doesn't exist.")) {  
                    console.log("[INJECT ERROR] - " + stdout)
                    return res.status(500).send(`Erreur lors de l'injection`);
                }    

                let injectedFileName = fileName.replace(".jar", "-injected.jar");
                let interval = setInterval(async () => {
                    try {
                        if (fs.existsSync(injectedFileName)) {
                            clearInterval(interval);
                            let fileStream = fs.createReadStream(injectedFileName);
                            res.setHeader('Content-disposition', `attachment; filename=${injectedFileName}`);
                            res.setHeader('Content-type', 'text/plain');
                            await fileStream.pipe(res);

                            console.log(`[LOG] - ${injectedFileName} injecté`);
                            fs.unlinkSync(fileName);
                            fs.unlinkSync(injectedFileName); 
                        }
                    } catch (e) {
                        console.log(`[ERROR] - ${e}`);
                        res.status(500).json({status: 500, message: `Internal error`});
                    }
                }, 1000);
            });
        });
    } catch (e) {
        console.log(`[ERROR] - ${e}`);
        res.status(500).json({status: 500, message: `Error while sending injected jar`});
    }
});

module.exports = router;