///<reference name="MicrosoftAjax.js"/>
///<reference name="wz_tooltip.js"/>

var ImageWrapperControl_ImageRolloverTimeoutId = 0;
var autoHideSpeed = 2500; //ms
var autoHideInterval;

function ImageWrapperControl_ShowRollOverImageFromCollection(imageId, rolloverDisplayMilliseconds) {
    var images = Global_GetImagesCollection();

    var image = images[imageId];
    var title = image.title;
    var description = image.description;
    var rolloverurl = image.rolloverUrl;

    ImageWrapperControl_ShowRollOverImage(title, description, rolloverurl, rolloverDisplayMilliseconds);

    //Tip('<div id=ej-box-modal-drop-shadow><div id=ej-box-modal-style-2><div id=ej-box-modal-header><div id=ej-box-modal-header-title>' + title +'</div><div id=ej-box-modal-header-close></div><div id=ej-clear-float></div></div><img src=' + rolloverurl + ' class=ej-article-body-img /><p>' + description + 
    //'</p></div></div>', BORDERWIDTH ,0, SHADOW, false, BGCOLOR, '', WIDTH , 0, DELAY, rolloverDisplayMilliseconds);
}

function ImageWrapperControl_ImageMouseOut() {
    UnTip();
    window.clearInterval(autoHideInterval)
}

function ImageWrapperControl_ShowRollOverImage(title, description, rolloverurl, rolloverDisplayMilliseconds) {

    Tip('<div id=ej-box-modal-drop-shadow><div id=ej-box-modal-style-4><table><tr><td><div id=ej-box-modal-image-4><table cellspacing=0 cellpadding=0><tr><td><img src=' + rolloverurl + ' alt=' + title +
    ' /></td></tr></table></div></td><td><div id=ej-box-modal-description-actions-4><div id=ej-box-modal-description-4><div id=ej-box-modal-header-title>' + title + '</div><p>' + description + '</p></div></div></td></tr></table><div id=ej-clear-float></div></div></div><div id=ej-clear-float></div>', BORDERWIDTH, 0, SHADOW, false, BGCOLOR, '', WIDTH, 0, DELAY, rolloverDisplayMilliseconds);
}

function ImageWrapperControl_ShowRollOverImage_NoCaption(rolloverurl, rolloverDisplayMilliseconds) {
    Tip('<div id="ej-box-modal-drop-shadow"><div id="ej-box-modal-style-4-nocap"><table><tr><td><div id="ej-box-modal-image-4"><table cellspacing="0" cellpadding="0"><tr><td><img src=' + rolloverurl + 
    '/></td></tr></table></div></td></tr></table><div id="ej-clear-float"></div></div></div><div id="ej-clear-float"></div>', BORDERWIDTH, 0, SHADOW, false, BGCOLOR, '', WIDTH, 0, DELAY, rolloverDisplayMilliseconds);

}

function ImageWrapperControl_ShowRollOverCoverImage(rolloverurl, rolloverDisplayMilliseconds) {
    Tip('<div id=ej-box-modal-drop-shadow-hover><div id=ej-box-image-hover><img src=' + rolloverurl +
    '/></div></div><div id=ej-clear-float></div>', BORDERWIDTH, 0, SHADOW, false, BGCOLOR, '', WIDTH, 0, DELAY, rolloverDisplayMilliseconds);

}

function ImageWrapperControl_ShowRollOverSupplementCoverImage(rolloverHTML, rolloverDisplayMilliseconds) {
    TagToTip(rolloverHTML, BORDERWIDTH, 0, SHADOW, false, BGCOLOR, '', WIDTH, 0, DELAY, rolloverDisplayMilliseconds);

}

function ImageWrapperControl_ShowDropDownMenu(imageId1, imageGalleryURL, hypId, isMagazine) {

    var emailText = 'Email to a Colleague';
    if(isMagazine == 'True')
    {
        emailText = 'Email to a Friend';
    }
    
    addToMyCollectionsLinkClicked(imageId1);
    var imageId = "'" + imageId1 + "'";
    Tip('<div id=ej-box-modal-drop-shadow><div id=ej-image-actions-drop><div id=ej-image-actions-header><div id=ej-image-actions-header-close><a href=javascript:void(0)>X</a></div><div id=ej-clear-float></div></div><ul><li><a href=javascript:showSlideShowByImageID(' + imageId + ')>Open in Slideshow</a></li><li><a href=javascript:showFullSizeByImageID(' + imageId + ')>View Full-Size Image</a></li><li><a href=' + imageGalleryURL + '>Open Image Gallery</a></li><li><a href=javascript:showAddToMyCollectionPopUp()>Add to My Favorites</a></li><li><a href=javascript:showEmailToColleaguePopUp()>' + emailText + '</a></li><li class=ej-image-actions-no-border><a href=javascript:slideShow_ExportToPPT(' + imageId + ');>Export to PPT Slide</a></li></ul></div></div>', STICKY, true, CLICKCLOSE, true, BGCOLOR, '', BORDERWIDTH, 0, DELAY, 0, OFFSETX, 0, OFFSETY, 0);
}

function showReference(scope, referenceText) {
    var rolloverDisplayMilliseconds = 0;
    Tip('<div id=ej-box-modal-drop-shadow-hover><div id=ej-box-text-hover>' + referenceText + '</div></div>', BORDERWIDTH, 0, SHADOW, false, BGCOLOR, '', WIDTH, 0, FONTCOLOR, '#000000', DELAY, rolloverDisplayMilliseconds);    
    /*
    autoHideInterval = window.setInterval( function(){ 
        ImageWrapperControl_ImageMouseOut();
    }, autoHideSpeed ); */
/*
     document.addEventListener.click(function (e)
         {
            ImageWrapperControl_ImageMouseOut();
         });*/
    document.addEventListener("touchstart", touchstartHandler);
    document.addEventListener("mousedown", touchstartHandler);
}

function touchstartHandler(e){
    ImageWrapperControl_ImageMouseOut();
    document.removeEventListener("touchstart", touchstartHandler);
}

function showImageForAccesionNumberAndImageID(_id, _id2){ 
    window.location = '#/full_text_image/?id='+_id+'&imageId='+_id2;
}