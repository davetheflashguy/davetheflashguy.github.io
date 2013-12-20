// Filename: collections/home
define(['underscore','backbone','models/global'], function(_, Backbone, GlobalModel)
{
    var GlobalCollection = Backbone.Collection.extend(
    {
        defaults: {
            model: GlobalModel,
        },


        /* initializer, start building our cache with some default data */
        initialize: function()
        {

        }
    });
    
    return GlobalCollection;
})
/* Save all of journal data under the "Sample Journal" namespace. */