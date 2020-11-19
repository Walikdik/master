/**
 * An apex page controller that exposes the site login functionality
 */
global with sharing class SiteLoginController {
    global String ss{get; set;}
    global String password {get; set;}

    global PageReference login() {
        String startUrl = System.currentPageReference().getParameters().get('startURL');
        return Site.login( ss, 'password', startUrl);
    }
    
    global SiteLoginController () {}
}