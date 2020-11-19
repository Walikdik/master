({
    doInit : function(component, event, helper) {
        component.set("v.showSpin", true);
        helper.getDetails(component, event, helper);
        //component.set("v.userId",$A.get("$SObjectType.CurrentUser.Id"));
        
        //alert('Bingo');
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition( 
                //sucess handler
                function(position) { 
                    //Create query for the API.
                    var key="key=ec8d388251e9408b951580624fc9aad0";
                    var latitude = ""+position.coords.latitude;
                    var longitude = ""+position.coords.longitude;
                    var location = "q="+latitude +","+ longitude;
                    var query = key+"&"+location + "&language=en&pretty=1";
                    
                    const Http = new XMLHttpRequest();
                    
                    var apiurl =
                        "https://api.opencagedata.com/geocode/v1/json?";
                    
                    apiurl += query;
                    
                    Http.open("GET", apiurl);
                    Http.send();
                    
                    Http.onreadystatechange = function() {
                        if (this.readyState == 4 && this.status == 200) {
                            var locationResult = JSON.parse(this.responseText);
                            console.log(locationResult);
                           	
                            if(locationResult && locationResult.results && locationResult.results[0].formatted) {
                                component.set("v.objCase.obCase.Location__c",locationResult.results[0].formatted);
                            }
                        }
                    };
                }
                //error handler
                , function (errorObj) { 
                    //alert(errorObj.code + errorObj.message); 
                    var toastEvent = $A.get("e.force:showToast");
                    var message = errorObj.message;
                    toastEvent.setParams({
                        title: 'Error',
                        type: 'error',
                        message: message
                    });
                    
                    toastEvent.fire();
                    
                }, 
                {enableHighAccuracy: true, maximumAge: 10000}
            );
            
            
        }        
        else {
            var toastEvent = $A.get("e.force:showToast");
            var message = 'Geolocation is not supported by Device.';
            toastEvent.setParams({
                title: 'Error',
                type: 'error',
                message: message
            });
            
            toastEvent.fire();
        }
    },
    
    handleBack : function(component, event, helper) {
        component.set("v.isNew", false);
    },
    
    handleSubmit : function(component, event, helper) {
        var allValid = component.find('fieldId').reduce(function (validSoFar, inputCmp) {
            inputCmp.showHelpMessageIfInvalid();
            return validSoFar && !inputCmp.get('v.validity').valueMissing;
        }, true);
        if(allValid){
            debugger;
            var fileUploader = component.find('fileUploader');
            if(fileUploader.get("v.validFile")) {
                helper.createCase(component, event, helper);
            }
        }
    }
})