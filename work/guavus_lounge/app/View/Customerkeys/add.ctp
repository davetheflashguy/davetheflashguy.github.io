
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
				console.log('CustomerkeyCustomer:' + $('#CustomerkeyCustomer'));
			$('#CustomerkeyAccesskey').blur(function(event) {
	 				$this = $(this);
	 				$.ajax({ 
 						type: 'POST',
  					    url: '<?php echo $this->Html->url(array("controller"=>'Customerkeys','action'=>'validatekey'))?>',
  						data: {accesskey:$(this).val(),
  							customerkey_id:'<?php echo $customerkey_id;?>'
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
				$('#CustomerkeyCustomer').blur(function(event) {
	 				console.log('on out focus');
				});		 
    			$('.cancel button').click(function(event) {
			    location.href='<?php echo $url;?>' 			
     		});
	 		})
		</script>		
 
	</head>
<body>
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
				<li>
					<?php echo $this->Html->link( 
					          		$this->Html->image('keys-red.png', array('alt' => 'key')),
					          		'../customerkeys',
					          		array('escape' => false));
					 ?>
				</li>
				<li>
					<?php echo $this->Html->link( 
					          		$this->Html->image('products.png', array('alt' => 'products')),
					          		'../solutions',
					          		array('escape' => false));
					 ?>
				<li>
					<?php echo $this->Html->link(
							       $this->Html->image('activity.png', array('alt' => 'activity')),
							       '../activity',
							       array('escape' => false));
					?>
				</li>
			</ul>
		</div>
		<div id="new-key">
			<?php	
				echo $this->Form->create('Customerkey', array('action' => 'index')); 
				echo $this->Form->input('Views Keys', array('type'=>'submit','label'=>false));
				echo $this->Form->end();
		?>
		</div>
	</div>
	<div id="title">
			New Key
		</div>
	<div id="content">
	<div id="centered">
<?php echo 
			$this->element('customerkeys/form');
		echo "<div class='buttons'>";
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
