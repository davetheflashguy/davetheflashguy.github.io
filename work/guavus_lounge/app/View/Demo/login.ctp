<!DOCTYPE html>
<html class="main-page">
<head>
	<title>Guavus Home</title>
	 <?php echo $this->Html->css('cda.css'); ?>
	 <?php echo $this->Html->script(array('jquery-1.7.2.min.js'));?>

	 <script type="text/javascript">
	 	$(document).ready(function(){
	 		console.log($('.error-message').text());
	 		if ($('.error-message').text() != "") {
	 			$('#key-word-form').css('border-color','red');
	 			
	 		};	
	 	});	

	 </script>
</head>	
<body>
	<div id="wrap">
		<div id="main">
			<div class="logo">
				<?php echo $this->Html->image('guavus-lounge.png'); ?>
				
		</div>
	<div id="sidebar">
	<?php  
		echo $this->Form->create('login', array('type' => 'POST', 'id' => 'key-word-form'));
		echo $this->Form->input('key', array('type' => 'text', 'placeholder' => 'Key', 'label' => ''));
		echo $this->Form->submit('arrow.png', array('class' => 'submit-button'));
		echo $this->Form->end(); 
	?>	
	<div class='error-message' style='margin-top: 5px;'><?php echo $this->Session->flash(); ?></div>
	<br/>
	
	</div>
</div>
</body>
</html>
