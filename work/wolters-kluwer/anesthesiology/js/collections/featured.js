// Filename: collections/home
define(['underscore',
		'backbone',
		'models/global'
        ],
function (_, Backbone, GlobalModel)
{
	var FeaturedCollection = Backbone.Collection.extend(
	{

	    /* view variables */
    	globalModel: null,
	 
	    /* initializer which simply creates an instance of our global model */
    	initialize: function () {
    	    this.globalModel = new GlobalModel();
    	},

    	parse: function (data) {

    	    var items = [];

    	    $(data).find('Article').each(function (index) {
    	        var articleObj = new Object();
    	        articleObj.Abstract = $(this).find('Abstract').text();
    	        articleObj.ArticleAccessionNumber = $(this).find('ArticleAccessionNumber').text();
    	        articleObj.ArticleImageUrl = $(this).find('ArticleImageUrl').text();
    	        articleObj.FormattedAuthors = $(this).find('FormattedAuthors').text();
                articleObj.UnFormattedAuthors = $(this).find('Authors').text();
                articleObj.Title = $(this).find('Title').text();
                articleObj.Section = $(this).find('Section').text();
                articleObj.IssueCitationText = $(this).find('IssueCitationText').text();
    	        
                var temp = $(this).find('IsCME').text();
    	        (temp == "true") ? temp = true : temp = false;
    	        articleObj.IsCME = temp;

    	        var temp = $(this).find('IsCME').text();
    	        (temp == "true") ? temp = true : temp = false;
    	        articleObj.IsOpenAccess = temp;

    	        var temp = $(this).find('IsPAP').text();
    	        (temp == "true") ? temp = true : temp = false;
    	        articleObj.IsPAP = temp;

    	        var temp = $(this).find('IsSDC').text();
    	        (temp == "true") ? temp = true : temp = false;
    	        articleObj.IsSDC = temp;
    	        
    	        items.push(articleObj);
    	    });
            
    	    return items;
    	},

		fetch: function(options) {
		    options || (options = {});
		    options.dataType = "xml";
		    options.url = this.globalModel.featured_articles_by_shortname_fagroup;
		    Backbone.Collection.prototype.fetch.call(this, options);
		},
 	});
	
	return FeaturedCollection;
})