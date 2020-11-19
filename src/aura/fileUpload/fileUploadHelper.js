({
    MAX_FILE_SIZE: 10000000, //Max file size 10 MB  10000000
    CHUNK_SIZE: 750000,      //Chunk Max size 750Kb 
    
    // check the selected file size, if select file size greter then MAX_FILE_SIZE,
    // then show a alert msg to user,hide the loading spinner and return from function  
    validateFile: function(component, event,file) {
        let validFile =true;
        if (file.size > this.MAX_FILE_SIZE) {
            component.set("v.showLoadingSpinner", false);
            var errorMessage = 'Error : File size cannot exceed ' + this.MAX_FILE_SIZE + ' bytes.\n' + ' Selected file size: ' + file.size;
            component.set("v.fileName", errorMessage);
            var toastEvent = $A.get("e.force:showToast");
            
            component.set("v.showLoadingSpinner", false);
            //show success message
            toastEvent.setParams({
                title: 'Error',
                type: 'error',
                message: errorMessage
            });
            
            toastEvent.fire();
            validFile=false;
        }
        component.set("v.validFile", validFile);
        
        return validFile;
    },
    
    uploadHelper: function(component, event) {
        // start/show the loading spinner   
        component.set("v.showLoadingSpinner", true);
        // get the selected files using aura:id [return array of files]
        var fileInput = component.find("fileId").get("v.files");
        // get the first file using array index[0]  
        var file = fileInput[0];
        var self = this;
        
        //validate
        if(this.validateFile(component, event,file) ==false) {
            return;
        }
        // create a FileReader object 
        var objFileReader = new FileReader();
        // set onload function of FileReader object   
        objFileReader.onload = $A.getCallback(function() {
            var fileContents = objFileReader.result;
            var base64 = 'base64,';
            var dataStart = fileContents.indexOf(base64) + base64.length;
            
            fileContents = fileContents.substring(dataStart);
            // call the uploadProcess method 
            self.uploadProcess(component, file, fileContents);
        });
        
        objFileReader.readAsDataURL(file);
    },
    
    uploadProcess: function(component, file, fileContents) {
        // set a default size or startpostiton as 0 
        var startPosition = 0;
        // calculate the end size or endPostion using Math.min() function which is return the min. value   
        var endPosition = Math.min(fileContents.length, startPosition + this.CHUNK_SIZE);
        
        // start with the initial chunk, and set the attachId(last parameter)is null in begin
        this.uploadInChunk(component, file, fileContents, startPosition, endPosition, '');
    },
    
    
    uploadInChunk: function(component, file, fileContents, startPosition, endPosition, attachId) {
        // call the apex method 'saveChunk'
        var getchunk = fileContents.substring(startPosition, endPosition);
        var action = component.get("c.saveChunk");
        action.setParams({
            parentId: component.get("v.parentId"),
            fileName: file.name,
            base64Data: encodeURIComponent(getchunk),
            contentType: file.type,
            fileId: attachId
        });
        
        
        // set call back 
        action.setCallback(this, function(response) {
            // store the response / Attachment Id   
            attachId = response.getReturnValue();
            var state = response.getState();
            if (state === "SUCCESS") {
                // update the start position with end postion
                startPosition = endPosition;
                endPosition = Math.min(fileContents.length, startPosition + this.CHUNK_SIZE);
                // check if the start postion is still less then end postion 
                // then call again 'uploadInChunk' method , 
                // else, diaply alert msg and hide the loading spinner
                
                if (startPosition < endPosition) {
                    this.uploadInChunk(component, file, fileContents, startPosition, endPosition, attachId);
                } else {
                    var toastEvent = $A.get("e.force:showToast");
                    
                    component.set("v.showLoadingSpinner", false);
                    //show success message
                    toastEvent.setParams({
                        title: 'Success',
                        type: 'success',
                        message: "Ticket raised Successfully!"
                    });
                    
                    toastEvent.fire();
                    
                    //window.open('/'+component.get("v.parentId"));
                    this.navigateToRecord(component);
                }
                // handel the response errors        
            }
            else {
                component.set("v.showLoadingSpinner", false);
                
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
        });
        // enqueue the action
        $A.enqueueAction(action);
    },
    
    navigateToRecord : function(component) {
        var navEvent = $A.get("e.force:navigateToSObject");
        navEvent.setParams({
            recordId: component.get("v.parentId"),
            slideDevName: "detail"
        });
        navEvent.fire(); 
    }
})