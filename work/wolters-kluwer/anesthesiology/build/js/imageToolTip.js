function showReference(el, content){
	var content = "<div class='arrow_box'>"+content+"</div>";
    $('#page').append(content);

    //get the position of the placeholder element  
	var pos = $(el).offset();    
	var eWidth = $(el).outerWidth();
	var mWidth = $('#page').outerWidth();
	var left = (pos.left - 100) + "px";

	var top = 3+pos.top + "px";
	//show the menu directly over the placeholder  
	$('.arrow_box').css( { 
		position: 'absolute',
		zIndex: 5000,
		left: left, 
		top: top
	} );


	$('.arrow_box').click(function() {
		$('.arrow_box').hide();
	});
}


function showImageForAccesionNumberAndImageID(_id, _id2){ 
	window.location = '#/full_text_image/?id='+artAccNum+'&imageId='+_id2;
}