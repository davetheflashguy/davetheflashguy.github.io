var RemoveFoliosModel = Backbone.Model.extend({
 // Default attributes for the Library
    defaults: function () {
        return {
            /* Default model attributes */
        };
    },
});

var RemoveFoliosView = Backbone.View.extend({
        el: $("#main-wrapper"),
        folios: new Array(),
        data:null,
        groupsArray:null,
        foliosToBeRemoved: new Array(),
        removeFoliosViews : new Array(),

initialize: function(){
        var self = this;
        
        // set the page id 
        var root = document.getElementById('main-wrapper');
        root.setAttribute('data-page-id', 'remove-folios');
        $("#folios-container").remove();  

        var html = "<header class=\"header primary\" id=\"primary-header\"></header>";
            html += "<section class=\"section primary\" id=\"section-primary\"><ul></ul></section>";
        $("#main-wrapper").html(html);
        $("#section-primary").css("height", "100%");
                
        // get the data  
         var html = "<div class=\"column left header\">";
            html += "<div id=\"remove-folios-cancel-button\">Cancel</div></div>";
            html += "<div class=\"column middle header\"><div class=\"remove-folios-select-issues\">Select Issues</div></div>";
            html += "<div class=\"column right header\" style=\"text-align:right;margin-right: 0px;float:right\">";
            html += "<div id=\"remove-folios-select-all-button\">Select All</div>";
            html += "<div id=\"remove-button\" disabled=\"true\">Remove</div></div>";

        $("#primary-header").html(html);
        this.render();
},

render: function(){
    var self = this;
         $("#remove-folios-cancel-button").click(function(){
            self.removeFoliosViews.splice(0,self.removeFoliosViews.length);
            self.foliosToBeRemoved.splice(0,self.foliosToBeRemoved.length);
            window.history.back();
        });

        $("#remove-button").click(function(){
            self.removeFolios();
        }); 

        $("#remove-folios-select-all-button").click(function(){
            if($("#remove-folios-select-all-button")[0].innerHTML == "Select All"){
                self.foliosToBeRemoved.splice(0,self.foliosToBeRemoved.length);
                $(".remove-folio-image-container").each(function(){$(this).css('border','1px solid red')});
                $(".remove-folio-check").each(function(){$(this).css('display','block')});
                for(var i =0; i<self.removeFoliosViews.length;i++)
                {
                    self.foliosToBeRemoved.push(self.removeFoliosViews[i]);
                }
                self.updateSelectIssuesText();
                self.setRemoveButton();
                $("#remove-folios-select-all-button")[0].innerHTML = "Deselect All";
            }
            else{
                $(".remove-folio-image-container").each(function(){$(this).css('border','0px solid red')});
                $(".remove-folio-check").each(function(){$(this).css('display','none')});
                self.foliosToBeRemoved.splice(0,self.foliosToBeRemoved.length);
                self.updateSelectIssuesText();
                $("#remove-folios-select-all-button")[0].innerHTML = "Select All";
                self.setRemoveButton();
            }
        }); 
        this.data = sessionStorage.getItem("selectedLibrary");
        this.renderFolioIssues();
        return this;
},

renderFolioIssues: function () {
var self = this;
    var groupsArray = JSON.parse(this.data);
    for (var i = 0; i < groupsArray.length; i++) {
        for (var j = 0; j < groupsArray[i].length; j++) {
            if (isAPIAvailable) {
                var folioToRender = adobeDPS.libraryService.folioMap.internal[groupsArray[i][j].id];
                if(folioToRender.state == adobeDPS.libraryService.folioStates.INSTALLED && folioToRender.isArchivable == true){
                var removeFolioItemView = new RemoveFolioItemView({ model: folioToRender });
//                var removeFolioItemView = new RemoveFolioItemView({ model: groupsArray[i][j] });
                var el = removeFolioItemView.render().el;
                $("#section-primary").find("ul").append(el);
                this.removeFoliosViews.push(removeFolioItemView);
                removeFolioItemView.on("removeFolioSelected", function () {
                    if(jQuery.inArray(this,self.foliosToBeRemoved) == -1){
                        this.$el.find(".remove-folio-image-container").css('border','1px solid red');
                        this.$el.find(".remove-folio-check").css('display','block');
                        self.foliosToBeRemoved.push(this);
                        self.updateSelectIssuesText();
                        self.setRemoveButton();
                    }else{
                        this.$el.find(".remove-folio-image-container").css('border','0px solid red');
                        this.$el.find(".remove-folio-check").css('display','none');
                        self.foliosToBeRemoved.splice(jQuery.inArray(this,self.foliosToBeRemoved),1);
                        self.updateSelectIssuesText();
                        self.setRemoveButton();
                    }
                });
                removeFolioItemView.on("TransactionDone", function(){
                self.findAndRemove(this);
                });
                
                }
            }
        }
    }
},

updateSelectIssuesText: function (){
    var selectIssuesHTML = "";
    if(this.foliosToBeRemoved.length == 0){
        selectIssuesHTML = "Selected Issues";
    }else if(this.foliosToBeRemoved.length == 1){
        selectIssuesHTML = "1 Issue selected";
    }else{
        selectIssuesHTML = this.foliosToBeRemoved.length+" Issues Selected";
    }
    $(".remove-folios-select-issues")[0].innerHTML = selectIssuesHTML;

},

removeFolios: function(){
var self = this;
    for(var i = 0;i < this.foliosToBeRemoved.length ; i++){
        for(var m=0;m<this.removeFoliosViews.length;m++){
            if(this.foliosToBeRemoved[i].model.id == this.removeFoliosViews[m].model.id){
                this.removeFoliosViews[m].removeFolio();
            }
        }
    }
},

goBack : function(){
    if(this.foliosToBeRemoved.length == 0)
    {
        window.history.back();
    }
},

findAndRemove : function (folioToRemove) {
    var self = this;
    if(jQuery.inArray(folioToRemove,self.foliosToBeRemoved) == 0)
    {
        for(var i = 0;i < self.foliosToBeRemoved.length ; i++){
            if(self.foliosToBeRemoved[i].model.id == folioToRemove.model.id)
            {        
                self.foliosToBeRemoved.splice(i,1);
                self.updateSelectIssuesText();
            }
        }
    }
        if(self.foliosToBeRemoved.length == 0){
        self.goBack();
        self.removeFoliosViews.splice(0,self.removeFoliosViews.length);
    }
},

setRemoveButton : function(){
    var self = this;
    if(self.foliosToBeRemoved.length == 0)
    {
        self.$el.find("#remove-button").disabled = true;
        self.$el.find("#remove-button").css("opacity","40");
    }else{
        self.$el.find("#remove-button").disabled = false;
        self.$el.find("#remove-button").css("opacity","100");
    }
}
});