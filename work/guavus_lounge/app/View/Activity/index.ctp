<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8" />
		<title>Activity</title>
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
					          		$this->Html->image('products.png', array('alt' => 'products')),
					          		'../solutions',
					          		array('escape' => false));
					 ?>
				<li>
					<?php echo $this->Html->link(
							       $this->Html->image('activity-red.png', array('alt' => 'activity')),
							       '../activity',
							       array('escape' => false));
					?>
				</li>
			</ul>
		</div>
		<div id="new-key">
		 <?php	
				echo $this->Form->create('Customerkey', array('action' => 'add', 'type' => 'GET')); 
				echo $this->Form->input('New Key', array('type'=>'submit','label'=>false));
				echo $this->Form->end();
		?>
		</div>
	</div>
	
<div id="title">
	Customer Activity
</div>
<div id="flash">
<?php echo $this->Session->flash(); ?>
</div>

<div id="demo">
	<table cellpadding="0" cellspacing="0" border="0" class="display" id="example" width="100%">
	<thead>
	<tr>
		<th align='left'>solution</th>
		<th align='left'>key</th>
		<th align='left'>date</th>
		<th align='left'>activity</th>
	</tr>
	</thead>

<?php foreach ($data as $activity) { ?>
	<tr class="gradeU">
 		<td align="left"><?php 
 			echo $activity['Activity']['solution_name']; 
 			//$solution = $this->Solution->find('first', array('conditions' => array('id' => $solution_id)));
 			//$solutionName = $solution['Solution']['name'];
 			?></td>
 		<td align='left'><?php 
 			echo $activity['Activity']['customerkey'];
			//$keyData = $this->Customerkey->find('first',array('conditions'=>array('accesskey'=>$key)));
			//var_dump($keyData);
 			//$customerkey_id =  $activity['Activity']['customerkey_id']; ?>
 		
 		</td>
 		<td align='left'>
 			<?php 
				$logDate = $activity['Activity']['date']; 
				$parts = explode(" ", $logDate);
				$fullMonth = $parts[0];
				$date = explode("-", $fullMonth);
				$monthNum = $date[1];
				$month = monthMap($monthNum);
				echo $date[2]. "-" .$month . "-" . $date[0];
			 ?>
 		</td>
 		<td align='left'>
 			<div id="tool-bar">
				<ul style="padding:0">
				<?php 
					$isDownload = $activity['Activity']['isDownload'];
					$isSlide    = $activity['Activity']['isSlide'];
					$isDemo     = $activity['Activity']['isDemo'];
					$isEmail    = $activity['Activity']['isEmail'];
					if($isDownload) {
						echo $this->Html->image('download.png'); 
						//echo "<li class=\"download\"><a id=\"download\" href=\"\" target=\"_blank\">Download Presentation</a></li>";
						echo "&nbsp;";	
					}
					/*
					if($isSlide) {
						echo $this->Html->image('slides.png');
						echo "&nbsp;";	
					}
					*/
					if($isDemo) {
						echo $this->Html->image('demo-video.png');
						echo "&nbsp;";	
					}
				
					if($isEmail) {
						echo $this->Html->image('feedback.png');
					}	

					if (!$isDownload || !$isDemo || !$isEmail)
					{
						echo "&nbsp;";	
					}
				?>
				</ul>
			</div>
		</td>
 	</tr>
<?php } ?>
<tbody>
</table>
</div> <!-- datatable end -->
</div><!-- container end -->
</body>
</html>

