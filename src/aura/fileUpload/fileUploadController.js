({
    doSave: function(component, event, helper) {
        if (component.fileSelected(component, event, helper)) {
            console.log('File is selected');
            helper.uploadHelper(component, event);
        } else {
            console.log('File is not selected');
        }
    },
    
    fileSelected: function(component, event, helper) {
        if(component.find("fileId").get("v.files") != null && 
           component.find("fileId").get("v.files") != undefined 
          ) {
            return component.find("fileId").get("v.files").length > 0;
        }
        else {
            return false;
        }
    },
 
    handleFilesChange: function(component, event, helper) {
        var fileName = 'No File Selected..';
        if (event.getSource().get("v.files").length > 0) {
            fileName = event.getSource().get("v.files")[0]['name'];
        }
        
        // get the selected files using aura:id [return array of files]
        var fileInput = component.find("fileId").get("v.files");
        // get the first file using array index[0]  
        var file = fileInput[0];
        
        //validate
        if(helper.validateFile(component, event,file) ==false) {
            return;
        }
        component.set("v.fileName", fileName);
    	
    },
    
})