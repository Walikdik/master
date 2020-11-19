({
	doInit : function(component, event, helper) {
       	helper.getCaseData(component, event, helper);
	},
    saveVote : function(component, event, helper) {
        helper.saveCaseVote(component, event, helper);
	},
})