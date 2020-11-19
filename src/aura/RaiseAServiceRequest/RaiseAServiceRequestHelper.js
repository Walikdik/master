({
    getCategory : function(component, event, helper) {
        component.set("v.showSpin", true);
        var action = component.get("c.getCategoryPickValues");
        action.setCallback(this, function(response) {
            var state = response.getState(); 
            if (state === "SUCCESS") { 
                component.set("v.categories",response.getReturnValue());
            }else {
            	this.handleEror(response);   
            }
            component.set("v.showSpin", false);
        });
        $A.enqueueAction(action);
    },
    
    getCases : function(component, event, helper) {
        component.set("v.showSpin", true);
        var action = component.get("c.getRecords");
        action.setParams({ category : component.get("v.categoryValue") });
        action.setCallback(this, function(response) {
            var state = response.getState(); 
            if (state === "SUCCESS") {  
                var cases = response.getReturnValue();
                component.set("v.lstCase",cases);
            }else {
            	this.handleEror(response);   
            }
            component.set("v.showSpin", false);
        });
        $A.enqueueAction(action);
    },
    
    saveVote : function(component, event, helper) {
        component.set("v.showSpin", true);
        var action = component.get("c.saveCaseVote"); 
        action.setParams({ caseId : event.getSource().get("v.id"), category : component.get("v.categoryValue") });
        action.setCallback(this, function(response) {
            var state = response.getState(); 
            if (state === "SUCCESS") {  
                component.set("v.lstCase",null);
                var cases = response.getReturnValue();
                component.set("v.lstCase",cases);
                var toastEvent = $A.get("e.force:showToast");
        		var message = 'Voted successfully.';
                toastEvent.setParams({
                    title: 'Success!',
                    type: 'success',
                    message: message
                });
                
                toastEvent.fire();
                //this.getCases(component, event, helper);
            }else {
            	this.handleEror(response);   
            }
            
            component.set("v.showSpin", false);
        });
        $A.enqueueAction(action);
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