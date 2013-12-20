

(function(window)
{
	// stores configuration inforamation
	Player.configObj = new Object();
	// reference to player container
	Player.playerContainer = null;
	// reference to now playing container
	Player.nowPlayingContainer = null;
	// playlist array of track objects
	Player.playlist = [];
	// tracks the position of the playlist
	Player.playlistPosition = 0;
	// public reference (to this class) of the popcorn framework
	Player.popcorn = null;
	// reference to the video HTML
	Player.video = null;

	/**
	 *	Constructor
	 */
	function Player()
	{
		
	}

	/**
	 *	Public class function called by parent
	 *	This function instantiates the popcorn framework
	 *  and assigns a video to the player. 
	 * 
	 *	@_config reference to the configuration file
	 */
	Player.prototype.embedPlayer = function(_config)
	{
		$.getJSON(_config, configLoaded);
	}

	/**
	 *	This function gets called once the configuration file
	 *  has been loaded.  Once the data is stored into properties 
	 *	of the configuration object we set the playlist.
	 *
	 */
	function configLoaded(_data)
	{
		$.each(_data, function(i, item) 
		{   
			Player.configObj.playerDivId = item.Config.videoDivId;
      		Player.configObj.playlistUrl = item.Config.playlistUrl;
      		if (item.Config.nowPlayingDivId != null)
      		{
      			Player.nowPlayingContainer = item.Config.nowPlayingDivId;
      		}
      		if (item.Config.playlistDivId != null)
      		{
      			Player.playlistContainer = item.Config.playlistDivId;
      		}
      		// populate the playlist area
      		Player.configObj.height = item.Config.height;
      		Player.configObj.width = item.Config.width;
    	});
    	Player.playerContainer = Player.configObj.playerDivId;
		setPlaylist(Player.configObj.playlistUrl);
	}

	/**
	 *	This function gets called once when we want to set
	 * 	the playlist for the player.  
	 *
	 *	@_feedUrl url of JSON feed
	 */	
	function setPlaylist(_feedUrl)
	{
		Player.playListUrl = _feedUrl;
		$.getJSON(Player.playListUrl, playlistLoaded);
	}

	/**
	 *	This method (private) gets called once the
	 *	playlist gets loaded.
	 * 
	 * 	@jsonData json object
	 */
	function playlistLoaded(jsonData)
	{
		$.each(jsonData, function(i, item) 
		{   
      		var mediaObj = new Object();
      			mediaObj.id = item.Item.id;
      			mediaObj.title = item.Item.title;
      			mediaObj.thumbUri = item.Item.thumbUri;
      			mediaObj.posterUri = item.Item.posterUri;
      			mediaObj.videoUri = item.Item.videoUri;
      			Player.playlist.push(mediaObj);
    	});
    	initPlayer();	
	}

	/**
	 *	Adds the video tag to the DOM and instantiates 
	 *	the popcorn framework for use throughout this class
	 * 
	 */
	function initPlayer()
	{
		$(Player.playerContainer).append("<video height="+Player.configObj.height+" width="+Player.configObj.width+" id=\"videoContainer\" controls></video>")
		Player.popcorn = Popcorn("#videoContainer");
		Player.video = document.getElementsByTagName("video")[0];  
		Player.video.addEventListener("ended", onComplete);
		updatePlayer(Player.playlist[Player.playlistPosition]);
		
		var html = "<ul id=\"playlist\">";
			html += "<h1>Next Up:</h1>";

		for (var i=0; i < Player.playlist.length; i++)
		{
			var v = new Object(Player.playlist[i]);
			html += "<li id='"+i+"' style=\"font-family:helvetica, arial;font-size:11px\">";
			html += v.title;
			html +="</li>";

			$('#'+i).live("click", function(event){
   				 updatePlayer(Player.playlist[$(this).attr("id")]);
   			});
		}

		//html += "<div id=\"playlistItem\">Playing video "+ (Player.playlistPosition + 1) +" of 45</div>";

		$(Player.playlistContainer).html(html);
	}
			

	/**
	 *	This method is the only method that updates the player.
	 *	Call this when the player should update it's media.
	 * 
	 * 	@_vidObj video object
	 */	
	function updatePlayer(_vidObj)
	{
		// set the video source and poster
		var v = new Object(_vidObj);
		Player.video.src = v.videoUri;
		Player.video.poster = v.posterUri;
		$(Player.nowPlayingContainer).html("Now Playing: " + v.title);
	}
	

	/**
	 *	Sent when playback completes.
	 * 
	 */
	function onComplete(e)
	{
		playNextMediaItem();
	}

	/**
	 *	This method is gets called when you want to load
	 *  the next video in the playlist.  The method will 
	 *	check to see if the current video is the last in 
	 *	the playlist.  If it is then we go back to the 
	 *	first track in the playlist.
	 * 
	 */
	function playNextMediaItem()
	{
		if (Player.playlistPosition < Player.playlist.length)
		{
			Player.playlistPosition ++;	
			updatePlayer(Player.playlist[Player.playlistPosition]);	
		}
	}

	window.Player = Player;
	
}(window));