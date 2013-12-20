// Filename: collections/home
define(['underscore',
		'backbone',
		'models/global'
        ],
function (_, Backbone, GlobalModel)
{
	var FullTextImageCollection = Backbone.Collection.extend(
	{
	    /* view variables */
    	globalModel: null,
    	/* imageId */
    	imageId: null,
    	/* art acc */
    	artAccNum: null,

	    /* initializer which simply creates an instance of our global model */
    	initialize: function () {
    	    this.globalModel = new GlobalModel();
    	},

	    parse: function(data){
	    	
			var items = [];
			
			var imageView = new Object();
	    	    imageView.Description = $(data).find('Description').text();
	    	    imageView.ImageURL =  $(data).find('ImageURL').text();
  				
  				items.push(imageView);

	        return items;
		},

		fetch: function(options) {
			var uri = this.globalModel.full_image_by_accession_number.replace('{imageId}', this.imageId);
				uri = uri.replace('{accessionNumber}', this.artAccNum);
		    options || (options = {});
		    options.dataType="xml";
		    options.url = uri;
		    Backbone.Collection.prototype.fetch.call(this, options);
		},
 	});
	
	return FullTextImageCollection;
})