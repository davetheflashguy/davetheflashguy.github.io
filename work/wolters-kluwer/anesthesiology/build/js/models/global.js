// Filename: models/global
define(['underscore','backbone'], function(_, Backbone)
{
    var GlobalModel = Backbone.Model.extend(
    {
        defaults: 
        {
            /* Image directory on server */
            image_dir                              : "images/",
            /* Stores Accession Number for the current journal */
            accession_number                       : '00000542-201204000-00000',
            //journal_shortname                      : 'infectdis',
            journal_shortname                      : 'anesthesiology',
            //journal_shortname                      : 'jneuro-ophthalmology',
            featured_article_groupname             : 'featured%20articles',


            current_issue_obj                      : null,

            /* Stores default optional image displayed below the menu of application landing page */
            optional_issue_image                   : "",
            /* Stores the description text for a specfic journal */
            issue_description                      : 'For more than 5O years Plastic and Reconstructive Surgery® has been the one consistently excellent reference for every specialist who uses plastic surgery techniques or works in conjunction with a plastic surgeon. The journal brings readers up-to-the-minute reports on the latest techniques and follow-up for maxillofacial reconstruction, burn repair, cosmetic reshaping, as well as news on medicolegal issues. The cosmetic section provides expanded coverage on new procedures and techniques.',
            journal_by_accession_number            : null,
            journal_by_shortname                   : null,
            issue_by_accession_number              : null,
            current_issue_by_shortname             : null,
            tocarticle_list_by_accession_number    : null,
            tocarticle_list_for_current_issue      : null,
            full_text_by_accession_number          : null,
            full_image_by_accession_number         : null,
            featured_articles_by_shortname_fagroup : null,
            open_access_articles_by_shortname      : null,
            sign_in_with_credentials               : null,
            /* stores selected article object */
            selected_article_obj                   : null,
            /* stores a list of articles from the toc page for this journal */
            article_collection                     : null,

            pdf_by_accession_number_and_user_token : null,

            // URL for Integration  = http://test2010-services.pointbridge.com/integrationservices/mobilecontentservice.svc/
            
            // URL for QA           = http://stage-services.journals.lww.com/integrationservices/mobilecontentservice.svc/
            
            // URL for Prod         = http://services.journals.lww.com/integrationservices/mobilecontentservice.svc/
            

            service_root                           : 'http://stage-services.journals.lww.com/integrationservices/mobilecontentservice.svc/',
            // forgot password url
            forgot_password_url                    : 'http://journals.lww.com/_layouts/DPS/ForgotPassword.aspx?journalId={journal_short_name}',
            // register account url
            register_account_url                   : 'http://journals.lww.com/_layouts/DPS/Register.aspx?journalId={journal_short_name}',
        },

        initialize : function()
        {
            var o = this.getEnvironment();
                o += this.get('image_dir');
                o += "imagery.png"
            this.optional_issue_image = o;
            /* Web Service URL's */

            this.open_access_articles_by_shortname = this.get('service_root') + 'OpenAccessArticleListByJournalShortName?journalShortName=' + this.get('journal_shortname');
            this.featured_articles_by_shortname_fagroup = this.get('service_root') + 'ArticleListByFeaturedArticleGroupAndJournalShortName?journalShortName=' + this.get('journal_shortname') + '&featuredArticleGroup=' + this.get('featured_article_groupname');
            this.journal_by_accession_number = this.get('service_root') + 'JournalByAccessionNumber?accessionNumber=' + this.get('accession_number');
            this.journal_by_shortname = this.get('service_root') + 'JournalByJournalShortName?journalShortName=' + this.get('journal_shortname');

            /* Using this url while dev is broken */
            this.journal_by_accession_number = this.get('service_root') + 'JournalByAccessionNumber?accessionNumber=' + this.get('accession_number');

            this.issue_by_accession_number = this.get('service_root') + 'IssueByAccessionNumber?accessionNumber=' + this.get('accession_number');

            this.current_issue_by_shortname = this.get('service_root') + 'IssueByIssueTypeAndJournalShortName?journalShortName=' + this.get('journal_shortname') + '&issueType=CurrentIssue';

            this.tocarticle_list_for_current_issue = this.get('service_root') + 'TOCArticleListByIssueTypeAndJournalShortName?journalShortName=' + this.get('journal_shortname') + '&issueType=CurrentIssue';

            this.tocarticle_list_by_accession_number = this.get('service_root') + 'TOCArticleListByAccessionNumber?accessionNumber=' + this.get('accession_number');
            
            this.full_text_by_accession_number = this.get('service_root') + 'FullTextByAccessionNumber?accessionnumber={accessionNumber}';
            this.full_image_by_accession_number = this.get('service_root') + 'ImageByAccessionNumberAndImageId?accessionNumber={accessionNumber}&imageId={imageId}';
            
            this.sign_in_with_credentials                      = "https://stage-services.journals.lww.com/IntegrationServices/EntitlementsServices.svc/SignInWithCredentials?emailAddress={username}&password={password}"

            this.pdf_by_accession_number_and_user_token        = this.get('service_root') + 'PdfByAccessionNumberAndUserToken?accessionNumber={AccessionNumber}&userToken={UserToken}'


            // set default article for testing
            this.selected_article_obj = new Object({"journalTitle": "Anesthesiology", "journalDescription": "Anesthesiology founded in 1940, leads the world in…nsform the practice of medicine in our specialty.", "currentIssueCoverURL": "http://images.test2010.journals.pointbridge.com/anesthesiology/iPad.00000542-201204000-00000.CV.jpeg", "IssueCitiationText": "Vol. 116, No. 4, April 2012", "currentIssueHeaderBackgroundURL": "http://wkipad.azurewebsites.net/anesthesiology/images/imagery.png"});
            this.article_collection = "something";

            // sets the register account url
            this.register_account_url = this.get('register_account_url').replace('{journal_short_name}', this.get('journal_shortname'));

            // sets the forgot password url
            this.forgot_password_url = this.get('forgot_password_url').replace('{journal_short_name}', this.get('journal_shortname'));

        },

        /* Returns a directory prefix based on where this is being ran from */
        getEnvironment : function()
        {
            if (location.host == "localhost")
            {
                return location.protocol + "//" + location.host + location.pathname;
            }else
            {
                return "http://wkipadqa.azurewebsites.net/anesthesiology/";
            }  
        },
        setCurrentArticle : function(_obj){
            this.current_issue_obj = new Object(_obj);

            console.log('saved selected', this.current_issue_obj.IssueAccessionNumber)
        },
        getCurrentArticle : function(){
            return this.current_issue_obj;
        },
        setSelectedArticle : function(_obj){
            this.selected_article_obj = new Object(_obj);
            //console.log('old is ', this.get('accession_number'));
            console.log('saved selected', this.selected_article_obj.IssueAccessionNumber)
        },
        getSelectedArticle : function(){
            return this.selected_article_obj;
        },
        getAccessionNumber : function(){
            return this.get('accession_number');
        },
        getJournalShortname: function () {
            return this.get('journal_shortname');
        },
        setArticleCollection : function(_coll){
            this.article_collection = _coll;
        },
        getArticleCollection : function(){
            return this.article_collection;
        },
    });
    
    return GlobalModel;
})