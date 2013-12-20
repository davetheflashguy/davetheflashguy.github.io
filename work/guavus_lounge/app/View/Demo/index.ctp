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
    		_V_.options.flash.swf = "/lounge/app/webroot/js/video-js.swf";
  		</script>
		<style type="text/css">
		</style>
		<script type="text/javascript">
			var guavusdisp = {}
			guavusdisp.tracker = function() {
				var handleLinkClick = function () {
					var linkhash = {
						download:{isDownload:1},
						slide_name:{isSlide:1},
						demo_url:{isDemo:1}, 
						feedback:{isEmail:1}
					};
					$.each(linkhash,function(key,val) {
						
						$('#tool-bar').on('click','a#'+key,function(event) {
							event.preventDefault();
							var dat = { 
								accesskey: '<?php echo $accesskey ?>', 
								solution: $('body').data('product'), 
								isDownload: '',
								isSlide: '', 
								isDemo: '', 
								isEmail: ''
						 	}
							dat = $.extend(dat,val); 
							$.post("/guavus/cakephp/demo/test",dat)
							location.href = $(this).attr('href');
						});	
						
					});

				}
				return {
					init : function() {
						handleLinkClick();
					}
				}	
			}()
		
			
			guavusdisp.slide = function() {
				var vplayer = "";
				var timer = "";
				var slidestate = "";
	

				
				var handleIndexExpand = function() {
					$('#colleft').on('click','.product-expand',function(event) {
						event.preventDefault();
						$('#panel').find('.prod-items').hide();
						$(this).closest('.prod-group').find('.prod-items').toggle('fast');
				
				
					})		
			
				}
				
					
				
				var handleAutoClose = function() {
					
			
					
					$('#panel table').on('mouseenter',function() {
						if (timer) clearTimeout(timer);
					}) 
					$('#panel table').on('mouseleave',function() {

					function closeit () {
						//declared closeit to get rid of flicker.
						//triggering the click event on close-slide somehow causes a flicker
						if (timer) clearTimeout(timer);
						$("#panel").toggle("fast");
						$("#open-div").css('display','block');
						if ($('#vidplayer').data('reload') == true) {
							$('#vidplayer').data('reload',false);
							vplayer.play();
						}	
						slidestate = 'close';


						return false;
					
				}	
					
						if (slidestate != 'close') {
							//	timer = setTimeout("$('.close-slide').trigger('click')", 2000)
		timer = setTimeout(closeit, 2000)								
							}
	
					}) 
				}		
												
				var handleOpen = function() {
					$(".open-slide").click(function(event){
			
						if (timer) clearTimeout(timer);


				        $("#panel").toggle("fast");
				        $("#open-div").css('display','none');
						slidestate = 'open';


				        return false;
				    });
					
				} 
				

				
				
				var handleClose = function() {
					$(".close-slide").click(function(event){
			

						if (timer) clearTimeout(timer);

						
						$("#panel").toggle("fast");
						$("#open-div").css('display','block');
						if ($('#vidplayer').data('reload') == true) {
							$('#vidplayer').data('reload',false);
							vplayer.play();
						}	
						slidestate = 'close';


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
						handleAutoClose();
					}
				}
			}();
			

			$(document).ready(function(){
				guavusdisp.slide.init();
				guavusdisp.tracker.init();
				_V_("vidplayer", {}, function(){
      // Player (this) is initialized and ready.
    			});
			});
		</script>				
	</head>
	<body>
		<div id="wrap">
		<div id="main">
			<div id="current-section">wireless</div>
			<div id="next-section">Next (Campaign Management)</div>
			<div id="title-container"><h1>Roaming Reduction</h1></div>
			<div id="title-content">
				<p id="notes" class="desc">Sed tincidunt dictum viverra. Aliquam cursus, nunc ac feugiat suscipit, nunc lorem porta nisi, id euismod diam elit vel mi. Mauris volutpat accumsan consectetur. Aenean ut odio nec justo sagittis egestas. Sed elit lorem, interdum id pretium blandit, hendrerit non odio. Nam rhoncus pulvinar interdum. Nullam posuere erat nec nisl adipiscing ac tincidunt odio fermentum. Sed quis sem ante.</p>
			</div>				
			<div class="video-content">
					<video width="900" height="506" class="video-js vjs-default-skin"  controls id="vidplayer">
						<source type="video/mp4" src=""></source>
					</video> 
			</div>
		<div id="sidebar">
			<div id="tool-bar">
				<ul>
					<li class="download"><a id="download" href="" target="_blank">Download Presentation</a></li>
					<!--<li class="slides"><a id="slide_name" href="" target="_blank">Quick-view Slides</a></li>-->
					<li class="launch-demo"><a id="demo_url" href="" target="_blank">Launch Demo</a></li>
					<li class="feedback"><a id="feedback" href="" target="_blank">Tell us what you think</a></li>
				</ul>
			</div>
		</div>
		<div class="logo">
				<?php echo $this->Html->image('guavus.png'); ?>
		</div>
	</div></div>
	<div id="open-div">
			<a class="open-slide" href="#"><?echo $this->Html->image('open-arrow.png'); ?></a>
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
				
				$products[$prod][$cat] .= "<dd><a class='menitem' href='#".$mitem['id']."'>".$mitem['name']."</a></dd>";
				#$count[$key] += 1;
			} else {
				$products[$prod][$cat] = "<dd><a class='menitem' href='#".$mitem['id']."'>".$mitem['name']."</a></dd>";				

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
			$closeImage = $this->Html->image('close-arrow.png');
			$disp .= "<div class='prod-group'>
						<a href='#' class='product-expand'>$prodkey</a>
						<dl class='prod-items'>
							$catdisp
							<a href='#' class='close-slide'>$closeImage</a>

							
						</dl>
					</div>";
		}
		echo $disp;					
		?>				
					</td>
					
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
			
				el:'#wrap', 
				myPlayer:_V_("vidplayer"),
				nextLink:function() {
					
					var id = this.model.get('id');
					var nextInd = itemOrderList['#' + id] +1;
					$('#next-section').html('');
					if (nextInd < itemsList.length) {
						$('#next-section').html('<a href="'+$(itemsList[nextInd]).attr('href')+'">Next ('+$(itemsList[nextInd]).text()+')</a>')
						
					}
						

					
				},
				render:function() {
					var logpath = '<?php echo $this->Html->url(array('action'=>'logdata','controller'=>'activity'));?>'
					var mediaPath = '<?php echo MEDIA;?>';
					
					var product_id = this.model.get('id');
					var customerkey_id ='<?php echo $customerkey_id ?>'; 
					var middle = '/' + customerkey_id + '/' + product_id +'?resource=';
					this.myPlayer.pause(); 
					$(this.el).find('h1').html(this.model.get('name'));
					$(this.el).find('#notes').html(this.model.get('notes'));
					
					$(this.el).find('#current-section').html(this.model.get('product'));
/*
					$(this.el).find('#download').attr('href',mediaPath +this.model.get('video_name'));					
					$(this.el).find('#slide_name').attr('href',mediaPath +this.model.get('slide_name'));
					$(this.el).find('#demo_url').attr('href',this.model.get('demo_url'));
*/			
					$(this.el).find('#download').attr('href',logpath + '/'+ 1 + middle + encodeURIComponent(this.model.get('video_name')));					
					$(this.el).find('#slide_name').attr('href',logpath + '/' +2  + middle +encodeURIComponent(this.model.get('slide_name')));
					$(this.el).find('#demo_url').attr('href',logpath + '/' + 3 + middle +encodeURIComponent(this.model.get('demo_url')));
					$(this.el).find('#feedback').attr('href',logpath + '/' + 4 + middle +encodeURIComponent('wschweitzer00@gmail.com'));
					

					this.myPlayer.src(mediaPath +this.model.get('video_name'));
					$('body').data('product',this.model.get('name'));
					this.nextLink();
					
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
//						$video_name = MEDIA . $mitem['video_name'];
//						$slide_name = MEDIA . $mitem['slide_name'];
						$video_name =  $mitem['video_name'];
						$slide_name =  $mitem['slide_name'];
				
						$demo_url = $mitem['demo_url'];
						$product = $mitem['product'];
						
						echo "this.slist.add({
							id:'$id',
							name:'$name',
							notes:$notes,
							video_name:'$video_name',
							slide_name:'$slide_name',
							demo_url:'$demo_url',
							product:'$product'
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
			
			var itemsList = "";
			var itemOrderList = {};
			$(document).ready(function(){
				itemsList = $('.prod-items a.menitem');
				itemOrderList = {};
				$.each(itemsList, function(i,el) {
					itemOrderList[$(el).attr('href')] = i; 
				} )

				new SolutionRouter();
				Backbone.history.start();

			
			});	

		</script>
	</body>
</html>	
