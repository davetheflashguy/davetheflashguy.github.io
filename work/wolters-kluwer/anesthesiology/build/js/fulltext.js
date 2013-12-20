
    function showHide(elementid, img)
    {
        if (document.getElementById(elementid).style.display == 'none')
        {
            document.getElementById(elementid).style.display = '';
            document.getElementById(img).src = "../images/icon-minus.gif";
        }
        else
        {
            document.getElementById(elementid).style.display = 'none';
            document.getElementById(img).src = "../images/icon-plus.gif";
        }
    }


    function showOutline()
    {
        $find("articleOutlinePopup").show();

    }
    
    function hideOutline()
    {
        if($find("articleOutlinePopup") != null)
        {  
            $find("articleOutlinePopup").hide();
        }
    }
      
    function showParagraph(paragraphid)
    {
	    $find("articleOutlinePopup").hide();
    }

   
   