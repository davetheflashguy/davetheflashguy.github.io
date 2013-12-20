<!DOCTYPE html>
<html>
	<head>
		<meta charset=utf-8>
		<!--[if IE]> 
			<script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
		<![endif]--> 
		<!--[if lte IE 7]> 
			<script src="js/IE8.js" type="text/javascript"></script>
		<![endif]--> 
		<!--[if lt IE 7]>  
			<link rel="stylesheet" type="text/css" media="all" href="css/ie6.css"/>
		<![endif]-->
		
		<?php 
			  echo $this->Html->css('jquery-ui-1.8.20.custom.css');
			  echo $this->Html->script(array('jquery-1.7.2.min.js'));
			  echo $this->Html->script(array('jquery-ui-1.8.20.custom.min.js'));
			  echo $this->Html->script(array('popcorn-complete.min.js'));
			  echo $this->Html->script(array('player-1.0.4.js'));
			  echo $this->fetch('meta');
			  echo $this->fetch('css');
			  echo $this->fetch('script');
			  
		?>
		
		<style>
			#open-div {
				display:none;
				position:absolute;
				top:150px;
				font-size:50px;
			}
			.prod-items {
				display:none;
			}
			#panel {
				display:none;
				position:absolute;
				top:100px;
				background:#FFFFFF;
				left:0;
				width:250px;
				z-index:10000;
				opacity: 1;		
				border:1px solid #111111;
				padding-left:10px;
				-moz-border-radius-topright: 20px;
				-webkit-border-top-right-radius: 20px;
				-moz-border-radius-bottomright: 20px;
				-webkit-border-bottom-right-radius: 20px;
					
				}
			
			#panel #colleft {
				width:230px;
			}
			
			#panel #colright {
				width:10px; 
				vertical-align:middle;
			}
			#panel .close {
				
			}
	
			#content-left{
				float:left;
				width:75%	
			}
			#content-right {
				float:right;
				width:25%;
			}
			
			#container {
				margin: 30px auto;
				width:95%;
			}
			#content-right ul {
				list-style-type: none;
			}
	
		</style>
		<script type="text/javascript">
			var guavusdisp = {}
			
		
			
			guavusdisp.slide = function() {
				
				var handleIndexExpand = function() {
					$('#colleft').on('click','.product-expand',function(event) {
						event.preventDefault();
						$(this).closest('.prod-group').find('.prod-items').toggle('fast');
				
				
					})		
			
				}
								
				var handleOpen = function() {
					$(".open-slide").click(function(event){
				    	event.preventDefault();
	
				        $("#panel").toggle("fast");
				        $("#open-div").css('display','none');
				       // $(this).toggleClass("active");
				        return false;
				    });
					
				} 
				
				var handleClose = function() {
					$(".close-slide").click(function(event){
						event.preventDefault();
						$("#panel").toggle("fast");
						$("#open-div").css('display','block');
						return false;
					});
					
				}
				var handleCenter = function() {
					$openDiv = $('#open-div');
					var top = ($(window).height() - $openDiv.outerHeight()) / 2;
					top = top < 0 ? 10:top;
					$openDiv.css('top',top);
					$openDiv.css('display','block');
					$panelDiv = $('#panel');
					var ptop = ($(window).height() - $panelDiv.outerHeight()) / 2;
					ptop = ptop < 0 ? 0:ptop;
					$panelDiv.css('top',ptop);

					
				}
				return {
					init:function() {
						handleCenter();
						handleOpen();
						handleClose();	
						handleIndexExpand();
					}
				}
			}();
			$(document).ready(function(){
				guavusdisp.slide.init();
				
			});
		</script>	
		<script>
			document.addEventListener("DOMContentLoaded", onDOMContentLoaded);

			function onDOMContentLoaded(e)
			{
				var p = new Player();
					p.embedPlayer("../../config/config-1.0.4.json");
			}
		</script>	
		
		
	</head>
	<body>
		<div id="container">
			<div id="header">
				<h1><?php echo $solution['Solution']['name'];?></h1>
				<?php echo $solution['Solution']['notes'];?>

			</div>
			<div id="content">
				<div id="content-left">
				<div id="nowPlayingContainer">
   				</div>
        		<div id="playerContainer">
	   			</div>
       <div id="footnote"></div>     
				</div>
				<div id="content-right">
				<ul id="activity">
					<li id="download"><?php echo $this->Html->link(
								 $this->Html->image('download.png'),
								 '../activity/logdata/1',
								 array('escape' => false));			 
						?>		 
					</li>
					<li id="slide"><?php echo $this->Html->link(
								 $this->Html->image('slides.png'),
								 '../activity/logdata/2',
								  array('escape' => false));		
						?>
					</li>
					<li id="launch-demo"><?php echo $this->Html->link( 
								$this->Html->image('launch-demo.png'),
								'../activity/logdata/3',
								 array('escape' => false));			
						?>
					</li>
					<li id="email"><?php echo $this->Html->link(
								$this->Html->image('email.png'),
								'../activity/logdata/4',
								array('escape' => false));	
						?>
					</li>
				</ul>
				</div>					
			</div>
		</div>
		<div id="open-div">
			<a class="open-slide" href="#">&gt;</a>
		</div>
		
		<div id="panel">
			<table>
				<tr>
					<td id="colleft">

						
	<?php					
		$groups = array();
		$count = array();
		$disp = "";
		foreach ($menuItems as $mitem) {
			
			$key = $mitem['product'];
			
			if (array_key_exists($key,$groups) ) {
				$groups[$key] .= "<li>".$mitem['name']."</li>";
				$count[$key] += 1;
			} else {
				$groups[$key] = "<li>".$mitem['name']."</li>";
				$count[$key] = 1;
			}
					
		}
	
		$keys = array_keys($groups);
		foreach ($keys as $key) {
			$disp .= "<div class='prod-group'>
						<a href='#' class='product-expand'>$key</a>
						<ul class='prod-items'>$groups[$key]</ul>
					</div>";
		}
		echo $disp;					
		?>				
					</td>
					<td id="colright"><a href="#" class="close-slide">&lt;</a></td>
				</tr>
			</table>
				
		</div>
	</body>
</html>	

