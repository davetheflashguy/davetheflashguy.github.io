// Filename: collections/toc
define(['underscore',
		'backbone',
		'models/global'], 
function(_, Backbone, GlobalModel)
{
	var TOCCollection = Backbone.Collection.extend(
	{
	    /* view variables */
    	globalModel : null,
	 	
	 	/* initializer which simply creates an instance of our global model */
	    initialize : function()
	    {
	    	this.globalModel = new GlobalModel();
	    },
	    parse: function(data){
	    	
	    	var items = [];
		    
		    var articleObj = new Object();
		    	articleObj.Abstract = null;
		    	articleObj.ArticleAccessionNumber = null;
		    	articleObj.ArticleImageUrl = null;
		    	articleObj.Authors = null;
		    	articleObj.IsCME = null;
		    	articleObj.IsOpenAccess = null;
		    	articleObj.IsPAP = null;
				articleObj.IsSDC = null;
		    	articleObj.Title = null;
		    	articleObj.IssueCitationText = null;

			$(data).find('Article').each(function (index) {
				articleObj = new Object();
		    	articleObj.Abstract = $(this).find('Abstract').text();
		    	articleObj.ArticleAccessionNumber = $(this).find('ArticleAccessionNumber').text();
				articleObj.ArticleImageUrl = $(this).find('ArticleImageUrl').text();
    	        articleObj.FormattedAuthors = $(this).find('FormattedAuthors').text();
                articleObj.UnFormattedAuthors = $(this).find('Authors').text();
					
				var temp = $(this).find('IsCME').text();
					(temp == "true") ? temp = true  : temp = false;
				articleObj.IsCME = temp;
					
				var temp = $(this).find('IsOpenAccess').text();
					(temp == "true") ? temp = true  : temp = false;
				articleObj.IsOpenAccess = temp;
					
				var temp = $(this).find('IsPAP').text();
					(temp == "true") ? temp = true  : temp = false;
				articleObj.IsPAP = temp;

				var temp = $(this).find('IsSDC').text();
					(temp == "true") ? temp = true  : temp = false;
				articleObj.IsSDC = temp;
				
				articleObj.Title = $(this).find('Title').text();
				articleObj.Section = $(this).find('Section').text();
				articleObj.IssueCitationText = $(this).find('IssueCitationText').text();
				items.push(articleObj);
			});
			//console.log('TOC Collection is returning ', items.length, ' items to toc view');
	        return items;
		},
		fetch: function(options) {
		    options || (options = {});
		    options.dataType="xml";
		    options.url = this.globalModel.tocarticle_list_for_current_issue;
		    Backbone.Collection.prototype.fetch.call(this, options);
		},
 	});
	
	return TOCCollection;
})