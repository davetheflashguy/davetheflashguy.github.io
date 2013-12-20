// Filename: collections/home
define(['underscore',
		'backbone',
		'models/global'
        ],
function (_, Backbone, GlobalModel)
{
	var FullArticleCollection = Backbone.Collection.extend(
	{
	    /* view variables */
    	globalModel: null,
    	artAccNum: null,

	    /* initializer which simply creates an instance of our global model */
    	initialize: function () {
    	    this.globalModel = new GlobalModel();
    	},

	    parse: function(data){
	    	
			var items = [];
			var fullTextObj = new Object();
	    	    fullTextObj.HTMLText = null;

        	// for each section grab all relavent information and stuff in an array
  			$(data).find('ArticleFullTextHTML').each(function () {
  	
  				var str = $(this).text();
			        str = str.replace('<![CDATA[', '');
			        str = str.replace(']]>', '');

			    var fullTextObj = new Object();
	    	    	fullTextObj.HTMLText = str;

  				items.push(fullTextObj)
			});
 
	        return items;
		},

		fetch: function(options) {
			var uri = this.globalModel.full_text_by_accession_number.replace('{imageId}', this.imageId);
				uri = uri.replace('{accessionNumber}', this.artAccNum);
		    options || (options = {});
		    options.dataType="xml";
		   	options.url = uri;
		    Backbone.Collection.prototype.fetch.call(this, options);
		},
 	});
	
	return FullArticleCollection;
})