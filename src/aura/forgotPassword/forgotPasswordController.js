({
    handleForgotPassword: function (component, event, helpler) {
                console.log('THe test')

        helpler.handleForgotPassword(component, event, helpler);
    },
    onKeyUp: function(component, event, helpler){
    //checks for "enter" key
        if (event.getParam('keyCode')===13) {
            helpler.handleForgotPassword(component, event, helpler);
        }
    },
    
    setExpId: function (component, event, helper) {
        var expId = event.getParam('expid');
        if (expId) {
            component.set("v.expid", expId);
        }
        helper.setBrandingCookie(component, event, helper);
    },

    initialize: function(component, event, helper) {
                console.log('THe test')

        $A.get("e.siteforce:registerQueryEventMap").setParams({"qsToEvent" : helper.qsToEventMap}).fire();
    }
})