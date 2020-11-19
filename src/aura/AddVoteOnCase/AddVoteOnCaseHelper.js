({
	getCaseData : function(component, event, helper) {
        component.set("v.showSpin", true);
        var action = component.get("c.getCaseRecord");
        action.setParams({ caseId : component.get("v.recordId") });
        action.setCallback(this, function(response) {
            var state = response.getState(); 
            if (state === "SUCCESS") {  
                var objCase = response.getReturnValue();
                component.set("v.caseRecord",objCase);
            }else {
            	this.handleEror(response);   
            }
            component.set("v.showSpin", false);
        });
        $A.enqueueAction(action);
    },
    
    saveCaseVote : function(component, event, helper) {
        component.set("v.showSpin", true);
        var action = component.get("c.saveCaseRecordVote"); 
        action.setParams({ caseId : component.get("v.recordId") });
        action.setCallback(this, function(response) {
            var state = response.getState(); 
            if (state === "SUCCESS") {  
                var objCase = response.getReturnValue();
                component.set("v.caseRecord",objCase);
                
                var toastEvent = $A.get("e.force:showToast");
        		var message = 'Voted successfully.';
                toastEvent.setParams({
                    title: 'Success!',
                    type: 'success',
                    message: message
                });
                
                toastEvent.fire();
            }else {
            	this.handleEror(response);   
            }
            
            component.set("v.showSpin", false);
        });
        $A.enqueueAction(action);
    },
    handleEror: function(response) {
        var state = response.getState(); 
        var toastEvent = $A.get("e.force:showToast");
        var message = '';
        
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