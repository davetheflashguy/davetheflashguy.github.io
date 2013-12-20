
<!DOCTYPE html>
<html>
	<head>
		<title>Customer Keys</title>
		<?php 
			  echo $this->Html->css('core.css');
			  echo $this->Html->css('jquery-ui-1.8.20.custom.css');
			  #echo $this->Html->css('jquery.ui.datepicker.css');
			  echo $this->Html->script(array('jquery-1.7.2.min.js'));
			  echo $this->Html->script(array('jquery-ui-1.8.20.custom.min.js'));
			  #echo $this->Html->script(array('jquery.ui.widget.js'));
			  #echo $this->Html->script(array('jquery.ui.datepicker.js'));
			  echo $this->Html->script(array('cms.js'));
			  
			 			  
			  $url = $this->Html->url(array('controller'=>'customerkeys',
    					'action'=>'index'));			  
		?>
		<script type="text/javascript">			
			$(document).ready(function() { 
			$('#CustomerkeyAccesskey').blur(function(event) {
	 				$this = $(this);
	 				$.ajax({ 
 						type: 'POST',
  					    url: '<?php echo $this->Html->url(array("controller"=>'Customerkeys','action'=>'validatekey'))?>',
  						data: {accesskey:$(this).val(),
  							//customerkey_id:'<?php echo $customerkey_id;?>'
  							},
  						success: function(data) {
  							$this.next('.error-message').remove();
  							var errMsg = "";
							$.each($(data),function(i,el){
								errMsg += el;
							})  							
  							$('<div class="error-message">'+errMsg+'</div>').insertAfter($this);
  							
  						}
  						
					});
				});		 
    			$('.cancel button').click(function(event) {
			    location.href='<?php echo $url;?>' 			
     		});
	 		})
		</script>		
 
	</head>
<body id="dt_example">
<div id="container" style="width:90%">	
	<div id="header">
		<div id="logo">
		 	<?php echo
		 		$this->Html->link( 
		 			$this->Html->image('home.png', array('alt' => 'Guavus Home')),
		 			'../',
		 			array('escape' => false));
		 	?>
		</div><!-- Header End -->

		<div id="nav">
			<ul>
				<li>keys</li>
				<li><?php echo $this->Html->link('solutions', '../solutions', array('style' => 'text-decoration:none')); ?></li>
				<li><?php echo $this->Html->link('activity', '../activity', array('style' => 'text-decoration:none')); ?></li>
			</ul>
		</div>
		<div id="new-key">

		</div>
	</div>
	
<div id="title">
	Access Keys
</div>
	<div id="content">
	<div id="centered">
		<?php echo $this->element('solutions/form');
		echo "<div class='buttons' style='margin-right: 22px;'>";
		echo '<div class="cancel">';	
			echo $this->Form->button('Cancel', array('type'=>'button'));	
		echo '</div>';
		echo $this->Form->input('Save', array('type'=>'submit','label'=>false));	
		echo "</div>";
		echo $this->Form->end();
		?>
	</div>	
	</div>
</div>	

</body>
</html>
</div>	


