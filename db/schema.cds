namespace demo.uploadcsv;

using { managed } from '@sap/cds/common';

type CalculationStatus: Integer enum {
  beforeCalculation = 0;
  inProgress = 1;
  Finished = 2; 
  Failed = -1;
  
};

entity Data {
    key itemID:        Association to Headers @assert.integrity:false;
    configID:      Association to ImportConfig;    
    longitude:     Decimal;
    latitude:      Decimal;
    optionalData1:  String(100);
    optionalData2:  String(100);
    optionalData3:  String(100);
    optionalData4:  String(100);
    optionalData5:  String(100);
    optionalData6:  String(100);
    optionalData7:  String(100);
    optionalData8:  String(100);
    optionalData9:  String(100);
    optionalData10: String(100);
};

entity Headers {
    key ID:     UUID @(Core.Computed : true);    
    optionalData1:     String(100);
    optionalData2:     String(100);
    optionalData3:     String(100);
    optionalData4:     String(100);
    optionalData5:     String(100);
    optionalData6:     String(100);
    optionalData7:     String(100);
    optionalData8:     String(100);
    optionalData9:     String(100);
    optionalData10:    String(100);
    Items: Composition of many Data on Items.itemID = $self       
};

entity ImportConfig {
    key ID:      UUID @(Core.Computed : true);
    title:       String(100);
    desc:        String(300);
	icon:		 String(100);
    colQty:      Integer;
    isBasicData: Boolean; 
    headerID:    Association to Headers @assert.integrity:false;
};

entity Profiles : managed {
        key ID     : UUID @(Core.Computed : true);
        title      : String(100);
        shortDescr : String(100);
        descr      : String;
        zoomLevel  : Integer;
        distance   : Decimal(6,3);
        formula    : String;
        calculationStatus : CalculationStatus default 0;
        endpoints  : Composition of many EndPoints on endpoints.profileID = $self; 
};


entity EndPoints {	
        key ID     : UUID @(Core.Computed : true);
        profileID  : Association to Profiles; 
	    endPoint   : String;	
	    isBasicData: Boolean;
        color      : String(25);
        title      : String(100); 
        shortDescr : String(100); 
        ImportConfigID : Association to ImportConfig; 
};
