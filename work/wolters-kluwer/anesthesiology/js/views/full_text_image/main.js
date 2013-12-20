define(['jquery',
        'underscore',
        'backbone',
        'collections/full_text_image', 
        'views/base',
        'zoom'], 
function($, _, Backbone, ViewCollection, BaseView, Zoom){

    var fullTextImage = BaseView.extend(
    {
        /* Master DOM element */
        el              : $("#page_container"),
        
        /* When our router sees a change and instantiates
           this view, initialize is the first method that gets
           called.  Anything that we want to happen before
           the view is rendered happens here */
        initialize: function()
        {    
          this.collection = new ViewCollection();
          this.collection.bind("add", this.modelBind);
          this.collection.bind("reset", this.render, this);
          this.collection.bind("change", this.change, this)
          
          var query_string = {};
          var query = window.location.href;
          var vars = query.split("&");
          for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
                // If first entry with this name
            if (typeof query_string[pair[0]] === "undefined") {
              query_string[pair[0]] = pair[1];
                // If second entry with this name
            } else if (typeof query_string[pair[0]] === "string") {
              var arr = [ query_string[pair[0]], pair[1] ];
              query_string[pair[0]] = arr;
                // If third or later entry with this name
            } else {
              query_string[pair[0]].push(pair[1]);
            }
          } 
     
          var URL = window.location.toString();
          var query = URL.match(/\?(.+)$/);
          var a = query[0];
              a = a.replace('?articleAccessionNumber=', '');
              a = a.replace('?id=','');
              a = a.replace('&imageId='+query_string.imageId, '')
          artAccNum = a;
          
          this.collection.imageId = query_string.imageId;
          this.collection.artAccNum = artAccNum;
          this.collection.fetch();

          //this.loadCSS(["full_article"]);
          
          /* We don't want to wait for our web service data to load
             to display the header and footer being those views
             are static and don't rely on web service data.  Create
             any DOM needed for these views */
          var html = "<div class = 'view_full_image'>";
              html += "<div id='header_container'>";
              html += "</div>";
              html += "<div id='menu_container'>";
              html += "</div>";
              html += "<div id='page'>";
              // add preloader
              html += "<div id='view_preloader_container'>";
              html += "<img src='"+this.globalModel.getEnvironment()+"images/preloader.gif' />";
              html += "</div>";  
              html += "</div>";
              html += "</div>";
          
          this.$el.html(html);
          console.log(this.$el.html())

        },
        change          : function(){
          
        },
        modelBind       : function(model){
          
        },
        /* Gets called each time our collection has 
           completed a fetch. */
        render          : function()
        {
          var imageViewCollection = this.collection.models[0];
          if (typeof(imageViewCollection) != 'undefined')
          {
            var script = document.createElement("script");
                script.type = 'text/javascript';
                script.src = this.globalModel.getEnvironment()+ "js/zoomHelper.js";
            container.appendChild(script);

            var newHTML = "<div id='zoom_container'></div>"
                newHTML += "<ul class='zoom_thumbnails'>"
                newHTML += "<li style='display:none'><span class='zoom_thumbnail_container'><a href='"+imageViewCollection.get('ImageURL')+"'><img src='"+imageViewCollection.get('ImageURL')+"'></a></span></li>";
                newHTML += "</ul>";
                newHTML += "<div id='decription'>";
                newHTML +=  this.cleanDATA(imageViewCollection.get('Description'));
                newHTML += "</div>";

               $("#page").html(newHTML);
          }
          $('#view_preloader_container').remove();
        }
      });
    return fullTextImage;
});