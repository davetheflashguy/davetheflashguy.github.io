function showReference(e,t){var t="<div class='arrow_box'>"+t+"</div>";$("#page").append(t);var n=$(e).offset(),r=$(e).outerWidth(),i=$("#page").outerWidth(),s=n.left-100+"px",o=3+n.top+"px";$(".arrow_box").css({position:"absolute",zIndex:5e3,left:s,top:o}),$(".arrow_box").click(function(){$(".arrow_box").hide()})}function showImageForAccesionNumberAndImageID(e,t){window.location="#/full_text_image/?id="+artAccNum+"&imageId="+t};