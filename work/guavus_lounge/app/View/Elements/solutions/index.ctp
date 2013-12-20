


	<div id="container">
		<div id="header">
        <div id="logo">
            <?php echo
                $this->Html->link( 
                    $this->Html->image('home.png', array('alt' => 'Guavus Home')),
                    '../',
                    array('escape' => false));
            ?>
        </div><!-- Header End -->
        <div id="new-key">

        </div>
<table>
    <tr>
        <th>Id</th>
        <th>Title</th>
    </tr>

    <!-- Here is where we loop through our $posts array, printing out post info -->

    <?php foreach ($solutions as $solution): ?>
    <tr>
        <td><?php echo $solution['Solution']['id']; ?></td>
        <td>
            <?php echo $this->Html->link($solution['Solution']['name'],
array('controller' => 'solutions', 'action' => 'edit', $solution['Solution']['id'])); ?>
        </td>
    </tr>
    <?php endforeach; ?>

</table>
</div>
</div>