<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8" />
		<title><?php echo $title_for_layout; ?></title>
		<?php 
			  echo $this->Html->css('core.css');
			  echo $this->Html->css('jquery-ui-1.8.20.custom.css');
			  echo $this->Html->script(array('jquery-1.7.2.min.js'));
			  echo $this->Html->script(array('jquery-ui-1.8.20.custom.min.js'));
			  echo $this->Html->script(array('cms.js'));
			  echo $this->fetch('meta');
			  echo $this->fetch('css');
			  echo $this->fetch('script');
		?>
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
				<li><?php echo $this->Html->link('keys', '../customerkeys', array('style' => 'text-decoration:none')); ?></li>
				<li>solutions</li>
				<li><?php echo $this->Html->link('activity', '../activity', array('style' => 'text-decoration:none')); ?></li>
			</ul>
		</div>
		<div id="new-key">
		 <?php	
				echo $this->Form->create('Solution', array('action' => 'add', 'type' => 'GET')); 
				echo $this->Form->input('New Solution', array('type'=>'submit','label'=>false));
				echo $this->Form->end();
		?>
		</div>
	</div>
	<div id="title">
		
	</div>
		
	<?php echo $this->fetch('content'); ?>

</div><!-- container end -->
</body>
</html>
