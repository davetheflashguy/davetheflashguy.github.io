<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8" />
		<title>Customer Keys</title>
		<?php echo $this->Html->css('datatables_page.css');
		      echo $this->Html->css('datatables_table.css');
			  echo $this->Html->css('core.css');
			  echo $this->Html->script(array('jquery-1.7.2.min.js'));
			  echo $this->Html->script(array('jquery.dataTables.js'));
			  
		?>
		<script type="text/javascript" charset="utf-8">
				var handleIndexExpand = function() {
					$('tbody').on('click','.product-expand',function(event) {
					event.preventDefault();
					$(this).closest('.prod-group').find('.prod-items').toggle();
			
			
					})		
		
				}
		
				$(document).ready(function() {
				 oTable = $('#example').dataTable({
				 	//"sScrollY": "400px",
					"iDisplayLength": 100,
				});
				handleIndexExpand();
			} );
			

		</script> 
		<style type="text/css">
			#example_length

			{ display: none; }
			#example_paginate { display: none; }
			#example_info {display:none;}
		
		</style> 

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
				echo $this->Form->create('Solution', array('action' => 'add', 'type' => 'GET')); 
				echo $this->Form->input('New Solution', array('type'=>'submit','label'=>false));
				echo $this->Form->end();
		?>
		</div>
	</div>
<div id="title">
	Solutions
</div>
<div id="flash">
<?php echo $this->Session->flash(); ?>
</div>
<div id="demo">
	<table cellpadding="0" cellspacing="0" border="0" class="display" id="example" width="100%">
	<thead>
	<tr>
		<th>vertical</th>
		<th>solution</th>
		<th>category</th>
		<th>media</th>
	</tr>
	</thead>
    <!-- Here is where we loop through our $posts array, printing out post info -->

    <?php foreach ($solutions as $solution): ?>
	<tr class="gradeU">
		 <td align='left'><?php $productName = $solution['Solution']['product']; 
		 
		 	if($productName == "Wireless") {
		 		echo $this->Html->image('wifi.png');
		 	}
			if($productName == "Broadband") {
		 		echo $this->Html->image('signal.png');
		 	}
			if($productName == "Cable") {
		 		echo $this->Html->image('tv.png');
		 	}
		 	
		 	?></td>
		<td>
			 <?php 
			 	echo $this->Html->link($solution['Solution']['name'], array('action' => 'edit', $solution['Solution']['id']));?> 		
		</td>    	
        <td align='left'><?php echo $solution['Solution']['category']; ?></td>
        <td>
        	<?php
        		$video = $solution['Solution']['video_name'];
        		$slide = $solution['Solution']['slide_name'];
				
				if(!empty($video)) {
					echo $this->Html->image('video.png');
					echo "&nbsp;";
				}
				/*
				if(!empty($slide)) {
				    echo $this->Html->image('slides.png');
				}
				*/
				
				
        	?>
        	
        </td>
    </tr>
    <?php endforeach; ?>
</table>
</div>


 
