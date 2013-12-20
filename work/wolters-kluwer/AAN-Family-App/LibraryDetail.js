// Library Detail Model
// ---------------
var LibraryDetailModel = Backbone.Model.extend({
    // Default attributes for the Library
    defaults: function () {
        return {
            /* Default model attributes */
        };
    },
});


// Library Detail View
// --------------
var LibraryDetailView = Backbone.View.extend({
    el: $("#main-wrapper"),
    // array of JSON object representing the folio data
    data: null,
    groupsArray: null,
    selectedYear: null,
    showAll : false,

    events: {

    },
    // The FamilyAppView listens for changes to its model, re-rendering.
    initialize: function () {
        // TODO:: line 37-41 should be inside app.js, wrapped by an event listener
        // remove the secondary section as it's not needed for this page
        $("#section-secondary").hide();

        // set the page id 
        var root = document.getElementById('main-wrapper');
        root.setAttribute('data-page-id', 'library-detail');
        
        $("#folios-container").remove();       
        
        var html = "<header class=\"header primary\" id=\"primary-header\"></header>";
            html += "<div id=\"detailPage-folios-container\">";
            html += "<section class=\"section primary\" id=\"section-primary\"></section>";
            html += "</div>";
        $("#main-wrapper").html(html);

        // adjust the height of the main wrapper
        //TODO: Add to core.css instead of doing it here
        $("#section-primary").css("height", "100%");

        // get the data for the selected sub library
        var s = sessionStorage.getItem('selectedLibrary');
        this.data = s;
        // at this point we have our collection data, so render the app
        this.render();
    },

    // Render the sign in module
    render: function () {
        var self = this;
        $.extend({
          getUrlVars: function(){
            var vars = [], hash;
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for(var i = 0; i < hashes.length; i++)
            {
              hash = hashes[i].split('=');
              vars.push(hash[0]);
              vars[hash[0]] = hash[1];
            }
            return vars;
          },
          getUrlVar: function(name){
            return $.getUrlVars()[name];
          }
        });
        var groupTitle = $.getUrlVar('id');

        groupsArray = JSON.parse(this.data);
        
        var group = [];
        // groups array is now the entire model for the app
        // so we'll need to filter it using the query string as an identifier
        for (var i=0; i < groupsArray.length; i++){
            var node = groupsArray[i];
            for (var k=0; k < node.length; k++){ 
                if (node[k].title == groupTitle) {
                    group.push(node[k]);
                }
            }
        }

        groupsArray = group;

        // write the header
        var html = "<div class=\"column left header\">";
            html += "<nav><ul>";
            html += "<li><div id=\"backBtn\">Back</div></li>";
            html += "</ul></nav></div>";
            html += "<div class=\"column right header\" style=\"text-align:right;margin-right: 0px\">";
            html += "<nav><ul>";

        var yearsArray = new Array();
        for (var i = 0; i < groupsArray.length ; i++) {
            var found = jQuery.inArray(groupsArray[i].publicationDate.split("-")[0], yearsArray);
            if (found == -1)
                yearsArray.push(groupsArray[i].publicationDate.split("-")[0]);
        }

        if (yearsArray.length != 0) {
            var yearsHTML = "<select><option value=\"AllYears\">All Years</option>";
            for (var y = 0; y < yearsArray.length ; y++) {
                yearsHTML += "<option value=\"" + yearsArray[y] + "\">" + yearsArray[y] + "</option>";
            }
            yearsHTML += "</select>";
        }

        var monthsHTML = "<select><option value=\"AllMonths\">All Months</option>";
            
        html += "<li><section class=\"all-years-drop-down\">"+yearsHTML+"</section></li>";
        html += "<li><section class=\"all-months-drop-down\" disabled=\"true\">" + monthsHTML+ "</select></section></li>";
        html += "<li><section id=\"on-device-select-checkbox\" class=\"on-device-select\"><input id=\"onDeviceCheckbox\" type=\"checkbox\" name=\"On Device\"></input></section></li>";
        html += "<li><section id=\"on-device-select-label\" class=\"on-device-select\"><label for=\"onDeviceCheckbox\" class=\"onDeviceCheckboxLabel\">On Device</label></input></section></li>";
        html += "</ul></nav>";
        html += "</div>";

        // write header
        $("#primary-header").html(html);

        // back button
        $("#backBtn").click(function () {
            window.history.back();
        });

        $(".all-years-drop-down").change(function () {
            if (isAPIAvailable) {
                self.computeFolioIssuesByYear();    
            }
        });

        $(".all-months-drop-down").change(function () {
            if (isAPIAvailable) {
                self.computeFolioIssuesByMonth();    
            }
        });

        $("#onDeviceCheckbox").click(function () {
            if (isAPIAvailable) {
                // if the checkbox is checked then show 
                // folios that are on the device
                if ($('#onDeviceCheckbox').is(':checked')) {
                    self.computeFolioIssuesDownloaded();    
                } else {
                    // otherwise show the default results
                    // reset the library otherwise the folios on the device will repeat
                    self.resetLibrary();
                    self.renderFolioIssues(groupsArray);
                }    
            }
        });

        $("#section-primary").html("<ul></ul>");
        
        var issuesToRender = groupsArray;
        this.renderFolioIssues(issuesToRender);

        if (isAPIAvailable) {
            this.checkInstalledFolios(groupsArray);
        }
        document.ontouchmove = function(e){ return true }
        return this;
    },

    //render issues 
    renderFolioIssues: function (selectedIssues) {
    if((window.location.href.slice(window.location.href.indexOf('?') + 1).split('&')[1]) != null)
            this.showAll = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&')[1].split('=')[1];
    var count = null;
    if(this.showAll)
        count =selectedIssues.length;
    else
        //count = Math.min(3,selectedIssues.length);
        count = Math.min(WKIPAD.Config.MINIMUM_ISSUES_ON_PAGE,selectedIssues.length);

    for (var i = 0; i < count; i++) {
        var folio = selectedIssues[i];
        var view = new SubLibraryDetailItemView({ model: folio });
        var el = view.render().el;
        $("#section-primary").find("ul").append(el);
    }
    if(!this.showAll && count == WKIPAD.Config.MINIMUM_ISSUES_ON_PAGE)
    //if(!this.showAll && count == 3)
        $("#section-primary").find("ul").append("<a class=\"all-issues-show-all-button\" href='#library-detail-view/?"+window.location.href.slice(window.location.href.indexOf('?') + 1).split('&')[0]+"&ShowAll=True'>Show All<div class=\"arrow-show-all\"></div></a>");
    },


    computeFolioIssuesByYear: function () {
        var monthsArray = new Array();
        for (var i = 0 ; i <= $(".all-years-drop-down").children()[0].length - 1; i++) {
            if ($(".all-years-drop-down").children()[0][i].selected == true)
                selectedYear = $(".all-years-drop-down").children()[0][i].innerText;
        }
        var selectedYearsData = new Array();
        for (var i = 0; i < groupsArray.length; i++) {
            if(selectedYear == "All Years"){
                selectedYearsData.push(groupsArray[i]);
            }
            if (groupsArray[i].publicationDate.split("-")[0] == selectedYear) {
                selectedYearsData.push(groupsArray[i]);
                monthsArray.push(groupsArray[i].publicationDate.split("-")[1]);
            }
        }

        var monthsMapping = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
        $("#section-primary").html("<ul></ul>");
        if (selectedYearsData.length == 0)//AllYears
            this.renderFolioIssues(groupsArray);
        else {
            $(".all-months-drop-down").disabled = false;
            var selectedYearToMonthHTML = "<select><option value=\"AllMonths\">All Months</option>";
            var sortedMonths = new Array();
            sortedMonths = monthsArray.sort();
            var monthsToDisplay = new Array();
            for (var y = 0; y < sortedMonths.length ; y++) {
                var month = monthsMapping[parseInt(sortedMonths[y] - 1)];
                if($.inArray(month,monthsToDisplay) == -1)
                    monthsToDisplay.push(month);
            }

            for(var m = 0; m< monthsToDisplay.length ;m++)
            {
                selectedYearToMonthHTML += "<option value=\""+monthsToDisplay[m]+"\">"+monthsToDisplay[m]+"</option>";
            }
            selectedYearToMonthHTML += "</select>";
            $(".all-months-drop-down")[0].innerHTML = selectedYearToMonthHTML;
            this.renderFolioIssues(selectedYearsData);
        }

    },

    computeFolioIssuesByMonth: function () {
        var selectedMonth = "";
        for (var i = 0 ; i <= $(".all-months-drop-down").children()[0].length - 1; i++) {
            if ($(".all-months-drop-down").children()[0][i].selected == true)
                selectedMonth = $(".all-months-drop-down").children()[0][i].innerText;
        }
        var selectedMonthsData = new Array();
        var monthsMapping = new Array("All Months","January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
       
        for (var i = 0; i < groupsArray.length; i++) {
            var selectedIntMonth = $.inArray(selectedMonth,monthsMapping)
            if((selectedMonth == "All Months") && (groupsArray[i].publicationDate.split("-")[0] == selectedYear)){
                selectedMonthsData.push(groupsArray[i]);
            }
            if ((groupsArray[i].publicationDate.split("-")[0] == selectedYear) && (groupsArray[i].publicationDate.split("-")[1] == selectedIntMonth))
                selectedMonthsData.push(groupsArray[i]);
        }

        $("#section-primary").html("<ul></ul>");
        this.renderFolioIssues(selectedMonthsData);
    },

    computeFolioIssuesDownloaded: function () {
        var downloadedFolios = new Array();
        for (var i = 0; i < groupsArray.length; i++) {
            if (groupsArray[i].state == adobeDPS.libraryService.folioStates.INSTALLED)
                downloadedFolios.push(groupsArray[i]);
        }

        $("#section-primary").html("<ul></ul>");
        this.renderFolioIssues(downloadedFolios);
    },
    // checks to see if any folios are installed
    checkInstalledFolios: function(_group) {
        var match = false; 

        for (var i = 0; i < _group.length; i++) {
            if (_group[i].state == adobeDPS.libraryService.folioStates.INSTALLED)
                match = true;
        }

        if (match == true) {
            this.showOnDeviceOption();
        } else {
            this.hideOnDeviceOption();
        }

    },
    // hide on device checkbox when no folios are installed
    hideOnDeviceOption: function() {
        $("#on-device-select-checkbox").hide();
        $("#on-device-select-label").hide();
    },
    // display on device checkbox when any number of folios are installed
    showOnDeviceOption: function() {
        $("#on-device-select-checkbox").show();
        $("#on-device-select-label").show();
    },
    // resets the library (needed for onDevice toggle)
    resetLibrary: function() {
        $("#section-primary").find("ul").html("");
    }
});