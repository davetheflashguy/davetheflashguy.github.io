// Filename: collections/home
define(['underscore',
		'backbone',
        'models/global'
],

function (_, Backbone, GlobalModel)
{
	var OACollection = Backbone.Collection.extend(
	{

	    /* view variables */
    	globalModel: null,
        comparator: function(item) {
            var art_acc = item.get('ArticleAccessionNumber');
                art_acc = art_acc.replace(/-/gi, "");

            return -Number(art_acc);
        },

	    /* initializer which simply creates an instance of our global model */
    	initialize: function () {
    	    this.globalModel = new GlobalModel();
    	},

    	parse: function (data) {

    	    var items = [];

    	    var issueObj = new Object();

    	    var articleObj = new Object();
    	    articleObj.id = null;
    	    articleObj.title = null;
    	    articleObj.authors = [];
    	    articleObj.section = null;
    	    articleObj.sdcURL = null;
    	    articleObj.cmeURL = null;
    	    articleObj.pressReleaseURL = null;

    	    var sectionObj = new Object();
    	    sectionObj.title = null;
    	    sectionObj.articles = [];
    	    sectionObj.issue = new Object();

    	    $(data).find('issue').each(function () {
    	        //var issueObj = new Object();
    	        $(this).find('volume').each(function (index) {
    	            issueObj.volume = $(this).text();
    	        });
    	        $(this).find('issue').each(function (index) {
    	            issueObj.issue = $(this).text();
    	        });
    	        $(this).find('datePublished').each(function (index) {
    	            issueObj.datePublished = $(this).text();
    	        });
    	    })

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
    	        articleObj.Authors = $(this).find('FormattedAuthors').text();

    	        var temp = $(this).find('IsCME').text();
    	        (temp == "true") ? temp = true : temp = false;
    	        articleObj.IsCME = temp;

    	        var temp = $(this).find('IsOpenAccess').text();
    	        (temp == "true") ? temp = true : temp = false;
    	        articleObj.IsOpenAccess = temp;

    	        var temp = $(this).find('IsPAP').text();
    	        (temp == "true") ? temp = true : temp = false;
    	        articleObj.IsPAP = temp;

    	        var temp = $(this).find('IsSDC').text();
    	        (temp == "true") ? temp = true : temp = false;
    	        articleObj.IsSDC = temp;
    	        articleObj.Title = $(this).find('Title').text();
    	        articleObj.Section = $(this).find('Section').text();
    	        articleObj.IssueCitationText = $(this).find('IssueCitationText').text();
    	        //console.log(articleObj.Title);
    	        items.push(articleObj);
    	    });



    	    return items;
    	},

    	fetch: function (options) {
    	    options || (options = {});
    	    options.dataType = "xml";
    	    options.url = this.globalModel.open_access_articles_by_shortname;
    	    Backbone.Collection.prototype.fetch.call(this, options);
    	},
 	});
	
	return OACollection;
})