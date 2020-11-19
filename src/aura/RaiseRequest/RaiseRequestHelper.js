({
    
    getDetails : function(component, event, helper) {
        component.set("v.showSpin", true);
        var action = component.get("c.getCaseDetails");
        var userId = $A.get("$SObjectType.CurrentUser.Id");
        
        action.setParams({ category : component.get("v.category") });
        action.setCallback(this, function(response) {
            var toastEvent = $A.get("e.force:showToast");
            var message = '';
            var state = response.getState(); 
            if (state === "SUCCESS") { 
                component.set("v.objCase",response.getReturnValue());
            }
            else {
            	this.handleEror(response);   
            }
            component.set("v.showSpin", false);
            
        });
        $A.enqueueAction(action);
    },
    validateFile: function(component, event, helper) {
        var fileUploader = component.find('fileUploader');
        return fileUploader.fileSelected(); 
    },
    createCase : function(component, event, helper) {
        component.set("v.showSpin", true);
        var action = component.get("c.saveRecord"); 
        action.setParams({ obCase : component.get("v.objCase").obCase, docId : component.get("v.docId") });
        action.setCallback(this, function(response) {
            var state = response.getState(); 
            if (state === "SUCCESS") { 
                component.set("v.caseRecordId", response.getReturnValue());
                var fileUploader = component.find('fileUploader');
                if(fileUploader.fileSelected()) {
                    fileUploader.attachFile();
                }
                else {
                    this.navigateToRecord(component, event, helper);
                }
                
            }
            else {
            	this.handleEror(response);  
                component.set("v.showSpin", false);
            }
        });
        $A.enqueueAction(action);
    },
    
    navigateToRecord : function(component, event, helper) {
        var navEvent = $A.get("e.force:navigateToSObject");
        navEvent.setParams({
            recordId: component.get("v.caseRecordId"),
            slideDevName: "detail"
        });
        navEvent.fire(); 
    },
    
    handleEror: function(response) {
        
        var toastEvent = $A.get("e.force:showToast");
        var message = '';
        var state = response.getState(); 
        if (state === "INCOMPLETE") {
            message = 'Server could not be reached. Check your internet connection.';
        } else if (state === "ERROR") {
            var errors = response.getError();
            if (errors) {
                for(var i=0; i < errors.length; i++) {
                    for(var j=0; errors[i].pageErrors && j < errors[i].pageErrors.length; j++) {
                        message += (message.length > 0 ? '\n' : '') + errors[i].pageErrors[j].message;
                    }
                    if(errors[i].fieldErrors) {
                        for(var fieldError in errors[i].fieldErrors) {
                            var thisFieldError = errors[i].fieldErrors[fieldError];
                            for(var j=0; j < thisFieldError.length; j++) {
                                message += (message.length > 0 ? '\n' : '') + thisFieldError[j].message;
                            }
                        }
                    }
                    if(errors[i].message) {
                        message += (message.length > 0 ? '\n' : '') + errors[i].message;
                    }
                }
            } else {
                message += (message.length > 0 ? '\n' : '') + 'Unknown error';
            }
        }
        
        toastEvent.setParams({
            title: 'Error',
            type: 'error',
            message: message
        });
        
        toastEvent.fire();
        
    }
})