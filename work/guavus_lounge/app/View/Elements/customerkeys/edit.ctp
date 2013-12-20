
	 	<?php echo $this->Form->create('Customerkey', array('action' => 'edit')); ?>
        <p class="name"> 
           <?php echo $this->Form->input('customer', array('label' =>'name')); ?>       
        </p>  
        <p class="email">  
        	<?php echo $this->Form->input('accesskey'); ?>
        </p>  
        <p>
        	<?php echo $this->Form->input('Product',array('multiple'=>'checkbox')); ?>
        </p>
        <p>
        	<?php echo $this->Form->input('expires',array('class'=>'datepicker','type'=>'text'));?>
        </p>
        <p class="web">  
        	<?php echo $this->Form->input('notes',array('type'=>'textarea')); ?>
        </p>  
			 