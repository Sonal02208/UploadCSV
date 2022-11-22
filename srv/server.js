const cds = require('@sap/cds')
const express = require('express')
const proxy = require('@sap/cds-odata-v2-adapter-proxy')
const fileupload = require('express-fileupload')
const papa = require('papaparse')
cds.env.features.fetch_csrf = false;

cds.on('bootstrap', (app) => {

    //Add your own middleware before any cds entities are added
    app.use(proxy())

    //Serve static resources incl. index.html
    app.use(express.static(__dirname + '/srv/public'))

    //File path
    // app.use(fileupload({ createParentPath: true }))

    //HTTP POST call to the endpoint /UploadFile from frontend to the async service 
    app.post('/UploadFile', fileupload({ createParentPath: true }),async (req, res) => {
        try {
            console.log("Server side => File uploaded called...");
            if (req.files) {
                const oFile = req.files.UploadedFile;
                const sCSV = oFile.data.toString('utf8');
                const oFilename = oFile.name.toLowerCase();
                var DbOperation = null;
                
                // Get full name of our CDS entity via Model Reflection API
                const db = await cds.connect.to('db');

                //Used papaparse library as it returns the parsed file 
                //as an array of objects which can be easily processed as CQL
                var oData;
                papa.parse(sCSV, {
                    header: true,
                    transformHeader: header => header.trim(),
                    complete: results => {
                        oData = results.data;
                    }
                });

                //Remove last line if its blank
                if(Object.keys(oData[oData.length - 1]).length === 0){
                   oData.pop();
                }

                //Identify the CDS entity name from the CSV file name
                if(oFilename.indexOf('data') > -1){
                 
                    const { Data } = db.entities;
                    

                    //Final prepared data for the entity
                    var aData = oData;

                    //Filter the IDs
                    let selectedEntries = oData.map(entry => entry.ITEMID_ID);

                    //Remove the IDs already present in the entity based on IDs
                    if (selectedEntries) {
                        const RemOperation = await cds.run(DELETE.from(Data).where({ ITEMID_ID: selectedEntries }));
                    }

                    //Insert the data to the entity 
                    DbOperation = await cds.run(INSERT.into(Data).entries(aData));

                }else if(oFilename.indexOf('endpoints') > -1){

                    const { EndPoints } = db.entities;

                    //Final prepared data for the entity
                    var aEndPoints = oData;

                    //Filter the IDs
                    let selectedEntries = oData.map(entry => entry.ID);

                    //Remove the IDs already present in the entity based on IDs
                    if (selectedEntries) {
                        const RemOperation = await cds.run(DELETE.from(EndPoints).where({ ID: selectedEntries }));
                    }

                    //Insert the data to the entity 
                    DbOperation = await cds.run(INSERT.into(EndPoints).entries(aEndPoints));
                    
                }else if(oFilename.indexOf('headers') > -1){
                    
                    const { Headers } = db.entities;

                    //Final prepared data for the entity
                    var aHeaders = oData;

                    //Filter the IDs
                    let selectedEntries = oData.map(entry => entry.ID);

                    //Remove the IDs already present in the entity based on IDs
                    if (selectedEntries) {
                        const RemOperation = await cds.run(DELETE.from(Headers).where({ ID: selectedEntries }));
                    }

                    //Insert the data to the entity 
                    DbOperation = await cds.run(INSERT.into(Headers).entries(aHeaders));
                    
                }else if(oFilename.indexOf('importconfig') > -1){
                    
                    const { ImportConfig } = db.entities;

                    //Final prepared data for the entity
                    var aImportConfig = oData;

                    //Filter the IDs
                    let selectedEntries = oData.map(entry => entry.ID);

                    //Remove the IDs already present in the entity based on IDs
                    if (selectedEntries) {
                        const RemOperation = await cds.run(DELETE.from(ImportConfig).where({ ID: selectedEntries }));
                    }

                    //Insert the data to the entity 
                    DbOperation = await cds.run(INSERT.into(ImportConfig).entries(aImportConfig));

                }else if(oFilename.indexOf('profiles') > -1){

                    const { Profiles } = db.entities;

                    //Final prepared data for the entity
                    var aProfiles = oData;

                    //Filter the IDs
                    let selectedEntries = oData.map(entry => entry.ID);

                    //Remove the IDs already present in the entity based on IDs
                    if (selectedEntries) {
                        const RemOperation = await cds.run(DELETE.from(Profiles).where({ ID: selectedEntries }));
                    }

                    //Insert the data to the entity 
                    DbOperation = await cds.run(INSERT.into(Profiles).entries(aProfiles));
                    
                }


                if (DbOperation.req.error.length === 0) {
                    console.log("End of insert");
                    console.log("File uploaded successfully (rows affected: " + DbOperation.req.results.affectedRows + " )");

                } else
                    console.error(req.error);
                
            } else {
                console.log('There are no files');
            }
        }
        catch (error) { console.error(error); }
    })


})