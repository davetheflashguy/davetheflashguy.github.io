/* 	home.js - collection
	This file is responsible for collecting and parsing all data
	required for the home view.  This class injects the DOM for the home view
	into our application without the use of template (.html) files
*/
define(['underscore',
		'backbone',
		'models/global', 
		'collections/global'], 
function(_, Backbone,  GlobalModel, GlobalCollection)
{
	var HomeCollection = Backbone.Collection.extend(
	{	

    	/* view variables */
    	globalModel : null,
	    journalObj : null,
	    currentIssueObj : null,
	    servicesCounter : 0,
	    items : [],

	    /* initializer which simply creates an instance of our global model */
	    initialize : function()
	    {
	    	this.globalModel = new GlobalModel();
	    },

	    /* parses data returned from the web services */
	    parse: function(data){
	    	var options;
	    	
	    	/* Go through parsing routine */
	        if (this.servicesCounter == 0)
	        {
	        	/* If servicesCounter is at 0 then we know we are parsing the journal information */
		    	journalObj = new Object();
		    	journalObj.Title = $(data).find('Title').text();
		    	journalObj.Description = $(data).find('Description').text();
		    	journalObj.currentIssueObj = null;
			    
			    // fetch our secondary web service call
			    options;
	        	options || (options = {});
				options.dataType="xml";
				options.url = this.globalModel.current_issue_by_shortname;
				//options.url = 'model/homepage.xml';
				Backbone.Collection.prototype.fetch.call(this, options);
			}
			else if(this.servicesCounter == 1)
			{
				/* If servicesCounter is at 1 then we know we are parsing the issue information */
				currentIssueObj = new Object();
				currentIssueObj.CoverURL = $(data).find('CoverURL').text();
	            currentIssueObj.IssueAccessionNumber = $(data).find('IssueAccessionNumber').text();
	            currentIssueObj.IssueCitiationText = $(data).find('IssueCitiationText').text();
	            // inject into return value
	            journalObj.currentIssueObj = currentIssueObj;
	       		// inject the object into our return value
			    this.items.push(journalObj);

	        	return this.items;  
			}
			else
			{
				return false;
			}
	        
	        this.servicesCounter ++;
		},
		fetch: function(options) {
		    options || (options = {});
		    options.dataType="xml";
		    options.url = this.globalModel.journal_by_shortname;
		    //options.url = 'model/homepage.xml';
		    Backbone.Collection.prototype.fetch.call(this, options);
		},
 	});
	
	return HomeCollection;
})