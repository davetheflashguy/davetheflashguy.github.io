
function HighlightKeyword(inputId) {
    var keyword = null;
    var cssHighlight = null;
    var chkBox = document.getElementById(inputId);
    //get the value in checkbox
    keyword = chkBox.value;
    //get the actual content of the article
    var body = getDivContentHtml().innerHTML;
    var regEx = null;

    cssHighlight = "ej-keyword-highlight";

    if (chkBox.checked == true) {
        
        var index = keyword.indexOf("*");

        if (index == -1) {
            regEx = new RegExp('(\\b' + keyword + '\\b)', 'ig');
        }
        else {
            regEx = new RegExp('(\\b' + keyword.substr(0, index) + ')', 'ig');
        }

        //replace the keyword by wrapping it in a SPAN tag and then applying css class
        body = body.replace(regEx, '<span class=' + cssHighlight + '>$1<\/span>');
        regEx = new RegExp('(<[^>]*)<span class=' + cssHighlight + '>(' + keyword + ')<\/span>(.*?>)', 'ig');
        body = body.replace(regEx, '$1$2$3');
        //Set the actual content with replaced value
        getDivContentHtml().innerHTML = body;
    }
    else {
        //find all the occurences of keyword along with applied css//find the current browser
        var brow = navigator.appName;
        if (brow.indexOf("Microsoft Internet Explorer") != -1) {
            //get rid of quotes around css class in case of IE
            regEx = new RegExp('<span class=' + cssHighlight + '>(' + keyword + ')<\/span>', 'ig');
        }
        else {
            regEx = new RegExp('<span class="' + cssHighlight + '">(' + keyword + ')<\/span>', 'ig');
        }
        //replace it with keyword only i.e css class is removed
        body = body.replace(regEx, '$1');
        //set the actual content with replaced value
        getDivContentHtml().innerHTML = body;
    }
}

function HighlightSearchTerms() {
    var c = new Array();

    var container = document.getElementById('ej-box-keyword-highlight-search');
    if (null != container) {
        c = container.getElementsByTagName('input');
    }
    if (null != c && c.length > 0) {
        for (var i = 0; i < c.length; i++) {
            if (c[i].type == 'checkbox') {
                HighlightKeyword(c[i].id)
            }
        }
    }
}