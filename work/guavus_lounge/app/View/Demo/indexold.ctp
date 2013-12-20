<!DOCTYPE html>
<html class="seconardy-page">
	<head>
		
		
		<?php 
			  echo $this->Html->script(array('jquery-1.7.2.min.js'));
			  echo $this->Html->script(array('underscore-min.js'));
			  echo $this->Html->script(array('backbone-min.js'));
			  echo $this->Html->css('cda.css');
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
			//	new SolutionRouter();
			//	Backbone.history.start();
				
			});
		</script>			
	</head>
	<body>

	<script type="text/template" id="solution_template">
		<div id="wrap">
			<div id="main">
				
				
				<div id="current-section"></div>
				<!--<div id="next-section">Next (Campaign Management)</div> -->
				<div id="title-content">
					<h1><%=name %></h1>
					<p class="desc"><%=notes %></p>
				</div>			
			
			<div class="video-content">
					<video width="850" height="477" controls preload="auto" id="vidplayer">
						<source type="video/mp4" src="<%=video_name %>"></source>
					</video> 
			</div>
				<div id="sidebar">
					<div id="tool-bar">
					<%=demo_url %>
					<%=slide_name %>					
					<ul>
						<li class="download"><a href="#download">Download Presentation</a></li>
						<li class="slides"><a href="#quick-slides">Quick-view Slides</a></li>
						<li class="launch-demo"><a href="#Launch-demo">Launch Demo</a></li>
						<li class="feedback"><a href="#feedback">Tell us what you think</a></li>
					</ul>
				</div>
			</div>
			<div class="logo">
				<?php echo $this->Html->image('guavus.png'); ?>
			</div>
		</div></div>
		</script>			
		<div id="container">
		</div>
		<div id="open-div">
			<a class="open-slide" href="#">&gt;</a>
		</div>
		
		<div id="panel">
			<table>
				<tr>
					<td id="colleft">
		
						
	<?php					
		$products = array();
		
		$count = array();
		$disp = ""; 
		foreach ($menuItems as $mitem) {
			$cat = $mitem['category'];
			$prod = $mitem['product'];
			
			if (isset($products[$prod][$cat]) ) {
				
				$products[$prod][$cat] .= "<dd><a href='#".$mitem['id']."'>".$mitem['name']."</a></dd>";
				#$count[$key] += 1;
			} else {
				$products[$prod][$cat] = "<dd><a href='#".$mitem['id']."'>".$mitem['name']."</a></dd>";				

				#$count[$key] = 1;
			}
					
		}
		$prodkeys = array_keys($products);
		foreach ($prodkeys as $prodkey) {
			$categories = $products[$prodkey];
			$catkeys = array_keys($categories);
			$catdisp = "";
			
			foreach($catkeys as $catkey) {
				$prod = $products[$prodkey][$catkey];
				
				$catdisp .= "<dt>$catkey</dt>
				$prod
				";
			}
			
			$disp .= "<div class='prod-group'>
						<a href='#' class='product-expand'>$prodkey</a>
						<dl class='prod-items'>
							$catdisp
						</dl>
					</div>";
		}
		echo $disp;					
		?>				
					</td>
					<td id="colright"><a href="#" class="close-slide">&lt;</a></td>
				</tr>
			</table>
				
		</div>
<script>
			Solution = Backbone.Model.extend({
				
			});


			Solutions = Backbone.Collection.extend({
		
					model: Solution
				})			

			var SolutionView = Backbone.View.extend({
		
				el:'#container', 
				template:_.template($('#solution_template').html()),
				render:function(id) {
		
					$(this.el).html(this.template(this.model.toJSON()));

				}
			})

			SolutionRouter = Backbone.Router.extend({
				routes: {
					":id" : "changeSolution",
					"" : "renderIndex"
				}, 
				initialize:function() {
				this.slist = new Solutions();
				<?php	
					foreach ($menuItems as $mitem) {
						$id = $mitem['id'];
						$name = $mitem['name'];	
						$notes = $mitem['notes'];
						$video_name = $mitem['video_name'];
						$slide_name = $mitem['slide_name'];
						$demo_url = $mitem['demo_url'];
						
						echo "this.slist.add({
							id:'$id',
							name:'$name',
							notes:'$notes',
							video_name:'$video_name',
							slide_name:'$slide_name',
							demo_url:'$demo_url'
						})
						 
						";
				}	
				?>

				
			},
				changeSolution: function(id) {
					sview = new SolutionView({model:this.slist.get(id)});
					sview.render();
				},
				renderIndex: function() {
					id = $('.prod-items dd a').first().attr('href').split("#")[1]
					sview = new SolutionView({model:this.slist.get(id)});
					sview.render();	
				}
			});
			
	
			

			
			$(document).ready(function(){
				new SolutionRouter();
				Backbone.history.start();

			
			});	

</script>
	</body>
</html>	
