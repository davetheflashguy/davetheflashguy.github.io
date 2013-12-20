<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>
	</title>
	<?php

		echo $this->Html->css(array('cake.generic','admin','jquery-ui-1.8.20.custom'));
		echo $this->Html->script(array('jquery-1.7.2.min','jquery-ui-1.8.20.custom.min','dialogpatch','cms'));
				
		
		echo $this->fetch('meta');
		echo $this->fetch('css');
		echo $this->fetch('script');
	?>
	<script>
	      $(document).ready(function() {
 
                $('.element_to_pop_up').dialog({
                  width:600,
                  modal:true,
                  open: function() {
  				    $('.ui-widget-overlay').css('position', 'fixed');
    			  }
                });

           
        });
	</script>
</head>
<body>
	<?php echo 
			$this->element('solutions/index',array('solutions' => $solutions))
	?>
	
	<div class="element_to_pop_up">
	<?php echo $this->Session->flash(); ?>

	<?php echo $this->fetch('content'); ?>
	</div>
	
</body>
</html>