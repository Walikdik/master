public class DuplicateCasesCntrl {
    
    @AuraEnabled
    public static List<Case> getDuplicateCaseRecords(Id recordId){
        return getDuplicateCases(recordId);
    }
    
    public static List<Case> getDuplicateCases(Id caseId){
        
        List<Case> potentialDuplicateCases = new List<Case>();
        
        Case caseObj = [SELECT Id, Subject, Type, Status, Reason  FROM Case WHERE Id =:caseId];
        
        if(caseObj.Status != 'Closed'){
            potentialDuplicateCases = [SELECT Id, Subject, CaseNumber, Reason, Type, Status FROM Case WHERE 
                                       Reason =:caseObj.Reason and Status != 'Closed' AND Id != :caseObj.Id order by createddate DESC, Total_Votes__c DESC LIMIT 10];
        }
        return potentialDuplicateCases;
    }
}