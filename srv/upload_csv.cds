using {demo.uploadcsv as my} from '../db/schema';


@path : 'catalog'
service Catalog {


    entity Headers as projection on my.Headers;  
              
    entity Data as projection on my.Data;    

    entity ImportConfig as projection on my.ImportConfig;

    entity Profiles  as projection on my.Profiles;

    entity EndPoints  as projection on my.EndPoints;

    type References {
        text: String(100);
        akey: UUID;    
        nodes: array of {
            text: String(100);
            akey: String(14);
        }  null; 
    }

    function getEndPoints(id : Profiles:ID) returns array of References;

    type CalcStatus {
       status: Boolean;
       qty: Integer; 
    }

    function ProfileCalculation(id : Profiles:ID ) returns CalcStatus;


};
