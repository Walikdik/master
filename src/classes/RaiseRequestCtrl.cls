public without sharing class RaiseRequestCtrl {
    
	@AuraEnabled
    public static wrapCase getCaseDetails(String category){
        wrapCase wp = new wrapCase();
        User objUser = [select id, 
                        		ContactId, 
                        		Contact.Name, 
                        		Street  
                        from user 
                        where id =:userinfo.getUserId()];
        wp.name = objUser.Contact.Name;
        Case ob = new Case();
        //ob.Location__c = objUser.Street;
        ob.Reason = category;
        wp.obCase = ob;
        return wp;
    }
    
    @AuraEnabled
    public static List<wrapCategory> getCategoryPickValues(){
        List<wrapCategory> lstWP = new List<wrapCategory>();
        Schema.DescribeFieldResult fieldResult = Case.Reason.getDescribe();
        List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
        for( Schema.PicklistEntry pickListVal : ple){
            wrapCategory wp = new wrapCategory();
            wp.value = pickListVal.getValue();
            wp.label = pickListVal.getlabel();
            lstWP.add(wp);
        }    

        return lstWP;
    }
    
    @AuraEnabled
    public static List<case> getRecords(String category){
        
        return getRecordsData(category);
    }
    
    public static List<case> getRecordsData(String category){
        
        return [select id, 
                		CaseNumber, 
                		Subject, 
                		Description, 
                		Total_Votes__c,
                		(select id,
                         		Case__c,
                         		User__c 
                         from Votes__r where User__c=:userinfo.getUserId())
                from Case 
                where Reason = :category 
                order by Total_Votes__c DESC limit 5];
    } 
    @AuraEnabled
    public static List<case> saveCaseVote(String caseId, String category){
        Vote__c ob = new Vote__c ();
        ob.Case__c = caseId;
        ob.User__c = UserInfo.getUserId();
        insert ob;
        return getRecordsData(category);
    }
    
    @AuraEnabled
    public static case getCaseRecord(String caseId){
        return [select id, 
                		CaseNumber, 
                		Subject, 
                		Description, 
                		Total_Votes__c,
                		(select id,
                         		Case__c,
                         		User__c 
                         from Votes__r where User__c=:userinfo.getUserId())
                from Case 
                where Id = :caseId];
    }
    
    @AuraEnabled
    public static case saveCaseRecordVote(String caseId){
        system.debug('caseId '+caseId);
        Vote__c objVote = new Vote__c ();
        objVote.Case__c = caseId;
        objVote.User__c = UserInfo.getUserId();
        insert objVote;
        return getCaseRecord(caseId);
    }
    
    
    
    @AuraEnabled
    public static String saveRecord(Case obCase,String docId){
        
        insert obCase;
        system.debug('!bingo '+docId);
        /*if(docId != null){
            List<ContentDocumentLink> lstCD = [select id, LinkedEntityId, ContentDocumentId, Visibility, ShareType from ContentDocumentLink where ContentDocumentId =: docId];
            if(!lstCD.isEmpty()){
                List<ContentDocumentLink> newlstCD = new List<ContentDocumentLink>();
                for(ContentDocumentLink ob: lstCD){
                    ContentDocumentLink cd = ob.clone();
                    cd.LinkedEntityId = obCase.Id;
                    newlstCD.add(cd);
                }
                insert newlstCD;
                //delete lstCD;
            }
        }
		*/
        return obCase.Id;
    }
    
    public class wrapCategory{
        @AuraEnabled
        public String label{get;set;}
        @AuraEnabled
        public String value{get;set;}
    }
    
    public class wrapCase{
        @AuraEnabled
        public String name{get;set;}
        @AuraEnabled
        public Case obCase{get;set;}
    }
}