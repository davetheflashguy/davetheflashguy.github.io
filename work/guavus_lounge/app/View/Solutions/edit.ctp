<!DOCTYPE html>
<html>
	<head>
		<title>Solutions</title>
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
		</div>
		<div id="nav">
			<ul>
				</li>
				<li>
					<?php echo $this->Html->link( 
					          		$this->Html->image('keys.png', array('alt' => 'key')),
					          		'../customerkeys',
					          		array('escape' => false));
					 ?>
				</li>
				<li>
					<?php echo $this->Html->link( 
					          		$this->Html->image('products-red.png', array('alt' => 'products')),
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
			Edit Solution
		</div>
	<div id="content">
	<div id="centered">	
<div id="centered">	
<?php 
 
	echo $this->element('solutions/form');
		echo "<div class='buttons' style='margin-right:25px'>";
		echo '<div class="cancel">';	
			echo $this->Form->button('Cancel', array('type'=>'button'));	
		echo '</div>';
		echo $this->Form->input('Save', array('type'=>'submit','name'=>'submitaction','label'=>false));	
		echo "</div>";
		echo $this->Form->end();
	
?>
	</div>
	</div>
	</div>
</div>
</body>
</html>