({
	doInitHelper : function(component, event, helper) {
		
        var action = component.get("c.getDuplicateCaseRecords");
        action.setParams({ 
            "recordId" : component.get("v.recordId")
        });
        action.setCallback(this, function(response) {
            if(response.getState() === "SUCCESS") {
                var returnVal = response.getReturnValue();
                if(returnVal != "" && returnVal != undefined){
                    component.set("v.isDuplicate", "True");
                    component.set("v.cases", returnVal);
                }
            }else{
                component.set("v.errorMsg", "Some error occured");
            }
        });
        $A.enqueueAction(action);
	},
    
    handleClickHelper : function(component, event, helper){
        var caseId = event.getSource().get("v.id");
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
            "recordId": caseId
        });
        navEvt.fire();
    }
})