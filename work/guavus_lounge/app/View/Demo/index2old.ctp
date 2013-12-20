<!DOCTYPE html>
<html class="seconardy-page">
	<head>
	
		<?php 
			  echo $this->Html->script(array('jquery-1.7.2.min.js'));
			  echo $this->Html->script(array('underscore-min.js'));
			  echo $this->Html->script(array('backbone-min.js'));
	  		  echo $this->Html->script(array('video.min.js'));
	  		  echo $this->Html->css(array('video-js.css'));
			  echo $this->fetch('meta');
			  //echo $this->fetch('css');
			  echo $this->Html->css('cda.css');
			  echo $this->fetch('script');
			  
		?>
		 <script>
    		_V_.options.flash.swf = "/guavus/cakephp/js/video-js.swf";
  		</script>
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
				border-top-right-radius: 20px;
				border-bottom-right-radius: 20px;
				-moz-border-radius-topright: 20px; 
				-moz-border-radius-bottomright: 20px;
				-webkit-border-top-right-radius: 20px;
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
				var vplayer = "";
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
						if ($('#vidplayer').data('reload') == true) {
							$('#vidplayer').data('reload',false);
							vplayer.play();
						}	
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
				
				var handleMenuItemClick =function() {
					$('.prod-items').on('click','a',function(event) {

					
					/*
					 set video status to reload in order to trigger auto play back on 
					 menu close
					 */
					$('#vidplayer').data('reload',true);
					});
				}
				return {
					init:function() {
						vplayer = _V_("vidplayer");
						handleCenter();
						handleOpen();
						handleClose();	
						handleIndexExpand();
						handleMenuItemClick();
					}
				}
			}();
			

			$(document).ready(function(){
				guavusdisp.slide.init();
	
				_V_("vidplayer", {}, function(){
      // Player (this) is initialized and ready.
    			});
			});
		</script>		
	</head>
	<body>
		<div id="wrap">
		<div id="main"></div>
				<div id="name"></div>
				<div id="notes"></div>
		<div id="title-content">
			<h1>Roaming Reduction</h1>
			<p class="desc">Sed tincidunt dictum viverra. Aliquam cursus, nunc ac feugiat suscipit, nunc lorem porta nisi, id euismod diam elit vel mi. Mauris volutpat accumsan consectetur. Aenean ut odio nec justo sagittis egestas. Sed elit lorem, interdum id pretium blandit, hendrerit non odio. Nam rhoncus pulvinar interdum. Nullam posuere erat nec nisl adipiscing ac tincidunt odio fermentum. Sed quis sem ante.</p>
		</div>			
			<div class="video-content">
					<video width="675" height="380" class="video-js vjs-default-skin"  controls id="vidplayer">
						<source type="video/mp4" src=""></source>
					</video> 
			</div>
				<div id="sidebar">
			<div id="tool-bar">
				<ul>
					<li class="download"><a href="#download">Download Presentation</a></li>
					<li class="slides"><a href="#quick-slides">Quick-view Slides</a></li>
					<li class="launch-demo"><a href="#Launch-demo">Launch Demo</a></li>
					<li class="feedback"><a href="#feedback">Tell us what you think</a></li>
				</ul>
			</div>
		</div>
		<div class="logo">
				<img src="guavus.png" alt="guavus"/>
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
				myPlayer:_V_("vidplayer"),
				render:function(id) {
					this.myPlayer.pause();
					$(this.el).find('#name').html(this.model.get('name'));
					$(this.el).find('#slide_name').html(this.model.get('slide_name'));
					$(this.el).find('#demo_url').html(this.model.get('demo_url'));
					$(this.el).find('#notes').html(this.model.get('notes'));
					this.myPlayer.src(this.model.get('video_name'));
					
					
					
//					$(this.el).find('video>source')[0].src = this.model.get('video_name');
//					$(this.el).find('video')[0].load();
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
						$notes = json_encode($mitem['notes']);
						$video_name = $mitem['video_name'];
						$slide_name = $mitem['slide_name'];
						$demo_url = $mitem['demo_url'];
						
						echo "this.slist.add({
							id:'$id',
							name:'$name',
							notes:$notes,
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
