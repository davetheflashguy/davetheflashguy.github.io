<?php echo $this->Html->script(array('jquery-1.7.2.min.js')); ?>
<script>
function addHit(id)
{
    $.ajax({
       type: "GET",
       url: "../activity/test/" + id,
       success: function(msg){
         alert( "Data Saved: " + msg ); //Anything you want
       }
     });
}

</script>

<ul>
	<li><?php echo $this->Html->link(
				 $this->Html->image('download.png'),
				 '',
				 array('onclick' => "addHit('1')", 'escape' => false));			 
		?>		 
	</li>
	<li><?php echo $this->Html->link(
				 $this->Html->image('slides.png'),
				 '',
				  array('onclick' => "addHit('2')", 'escape' => false));		
		?>
	</li>
	<li><?php echo $this->Html->link( 
				$this->Html->image('launch-demo.png'),
				'',
				 array('onclick' => "addHit('3')", 'escape' => false));			
		?></li>
	<li><?php echo $this->Html->link(
				$this->Html->image('email.png'),
				'',
				array('onclick' => "addHit('4')", 'escape' => false));	
		?></li>
</ul>
