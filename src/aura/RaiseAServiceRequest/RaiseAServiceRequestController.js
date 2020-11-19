({
	doInit : function(component, event, helper) {
		helper.getCategory(component, event, helper);
	},
    
    newRequest : function(component, event, helper) {
       
        if(component.get("v.categoryValue"))
        	component.set("v.isNew", true);
        else{
            var inputtemp = component.find("fieldIdSelect");
            inputtemp.showHelpMessageIfInvalid();
        }
            
	},
    
    saveVote : function(component, event, helper) {
        helper.saveVote(component, event, helper);
	},
    
    getCaseData : function(component, event, helper) {
		helper.getCases(component, event, helper);
	},
    navigateToRecord : function(component, event, helper) {
        var navEvent = $A.get("e.force:navigateToSObject");
        navEvent.setParams({
            recordId: event.target.value,
            slideDevName: "detail"
        });
        navEvent.fire(); 
    }
})