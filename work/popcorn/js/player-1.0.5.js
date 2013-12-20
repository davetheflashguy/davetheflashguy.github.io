(function(window)
{
	// stores configuration inforamation
	Player.configObj = new Object();
	// playlist array of track objects
	Player.playlist = [];
	// tracks the position of the playlist
	Player.playlistPosition = 0;
	// public reference (to this class) of the popcorn framework
	Player.popcorn = null;
	// reference to the video HTML
	Player.video = null;
	// flag for debugging mode
	Player.debugMode = false;

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
      			Player.configObj.nowPlayingContainer = item.Config.nowPlayingDivId;
      		}
      		if (item.Config.playlistDivId != null)
      		{
      			Player.configObj.playlistContainer = item.Config.playlistDivId;
      		}
      		if (item.Config.debugMode != null)
      		{
      			(item.Config.debugMode == "true") ? Player.debugMode = true : Player.debugMode = false;
      		}
      		// populate the playlist area
      		Player.configObj.height = item.Config.height;
      		Player.configObj.width = item.Config.width;
      		// determine if we should add controls
      		(item.Config.controls == "true") ? Player.configObj.controls = true : Player.configObj.controls =false;
    	});
    	Player.playerContainer = Player.configObj.playerDivId;
		log("Configuration file successfully loaded");
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
		log("Fetching the following playlist: " + _feedUrl);
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
    	log("Successfully loaded " + Player.playlist.length + " tracks from the playlist");
    	initPlayer();	
	}

	/**
	 *	Adds the video tag to the DOM and instantiates 
	 *	the popcorn framework for use throughout this class
	 *	Once popcorn is added it updates the video player
	 *	as well as the now playing componte and the legend
	 * 
	 */
	function initPlayer()
	{
		$(Player.playerContainer).append(generateVideoTag(Player.configObj.width, Player.configObj.height, "videoContainer", true))
		if (Player.popcorn != null || Player.popcorn != undefined)
		{
			Player.popcorn = Popcorn("#videoContainer");	
		}
		Player.video = document.getElementsByTagName("video")[0];  
		Player.video.addEventListener("ended", onComplete);
		var currVideoObj = Player.playlist[Player.playlistPosition];

		updatePosterImage(currVideoObj);
		updatePlaylist();
		updateLegend(currVideoObj);
		updatePlayer(currVideoObj);
	}

	/**
	 *	This method will return the html markup
	 *	that will add video considering the parameters
	 *	passed into this function
	 *
	 *	@_w width of the video player
	 *	@_h height of the video player
	 *	@_id div of the player
	 *	@_useControls boolean that determines if controls should be used
	 *
	 *	@ return markup to add to the document
	 *
	 */
	function generateVideoTag(_w, _h, _id, _useControls)
	{
		// sets defaults here
		(_w != null || _w != undefined) ? this.width = _w : this.width = 640;
		(_h != null || _h != undefined) ? this.height = _h : this.height = 360;
		(_id != null || _id != undefined) ? this.id = _id : this.id = "videoContainer";

		var	tag = "<video width=\""+this.width+"\" height=\""+this.height+"\" id=\""+this.id+"\" ";
		if (Player.configObj.controls == true)
		{
			tag += "controls";
		}

		tag += "></video>";
		console.log('tag: ' + tag);
		return tag;
	}	

	/**
	 *	This method is called when you want to update
	 *	the poster image in the video player.  This method
	 *	is primarly created for the start up sequence.
	 * 
	 * 	@_vidObj video object
	 */
	function updatePosterImage(_vidObj)
	{
		if (_vidObj != null)
		{
			// set the video source and poster
			var v = new Object(_vidObj);
			Player.video.poster = v.posterUri;
			log("Updated player poster image: " + _vidObj.poster);
		}
	}

	/**
	 *	This method is called when we want to update the playlist.
     *  Looks at Player.playlist array for playlist data
	 * 
	 */		
	function updatePlaylist()
	{
		$(Player.configObj.playlistContainer).html(generatePlaylist());
		log("Successfully generated playlist");
	}

	/**
	 *	This method is the only method that updates the player.
	 *	Call this when the player should update it's media.
	 * 
	 * 	@_vidObj video object
	 */	
	function updatePlayer(_vidObj, _autoStart)
	{
		if (_vidObj != null)
		{
			// set the video source and poster
			var v = new Object(_vidObj);
			Player.video.src = v.videoUri;
			updateNowPlaying(_vidObj);
			// check to see if the player should auto play
			if (_autoStart != null)
			{
				(_autoStart == true) ? Player.video.play() : null;
			}
			updateLegendCount();
			log("Updated player - current track: " + _vidObj.title);
		}
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
	 	e*the playlist.  If it is then we go back to the 
	 *	first track in the playlist.
	 * 
	 */
	function playNextMediaItem(e)
	{
		(Player.playlistPosition < Player.playlist.length-1) ? Player.playlistPosition ++ : Player.playlistPosition = 0;
		console.log('.. ' + Player.playlist[Player.playlistPosition].title);
		updatePlayer(Player.playlist[Player.playlistPosition]);	
	}

	/**
	 *	This method is gets called when you want to load
	 *  the previous video in the playlist.  The method will 
	 *	check to see if the current video is the first in 
	 *	the playlist.  If it is then we go back to the 
	 *	last track in the playlist.
	 * 
	 */
	function playPreviousMediaItem(e)
	{
		(Player.playlistPosition == 0) ? Player.playlistPosition = Player.playlist.length-1 : Player.playlistPosition --;
		updatePlayer(Player.playlist[Player.playlistPosition]);	
	}

	/**
	 *	This method updates the now playing div
	 *  based on Playlist.playlistPosition value
	 *
	 * 	@_vidoObj - video object that stores legend
	 *				values within it's properties
	 */
	function updateNowPlaying(_vidObj)
	{
		var v = new Object(_vidObj);
		$(Player.configObj.nowPlayingContainer).html("Now Playing: " + v.title);
	}

	/**
	 *	This method updates the legend accordingly
	 *  based on Playlist.playlistPosition value
	 *
	 * 	@_vidoObj - video object that stores legend
	 *				values within it's properties
	 */
	function updateLegend(_vidObj)
	{
		var v = new Object(_vidObj);
		$('#playlistLegendContainer').html("<div id=\"playlistLegendLeft\"></div><div id=\"playlistLegendRight\">Play <a href=\"#\" id=\"prevBtn\">prev</a> | <a href=\"#\" id=\"nextBtn\">next</a></div>");
		$('#nextBtn').live("click", function(event)
		{
			playNextMediaItem();
		});

		$('#prevBtn').live("click", function(event)
		{
			playPreviousMediaItem();
		});	
	}


	/**
	 *	This method gets called when we want 
	 *	to update the Playing X of N counter in
	 *	the legend
	 *
	 */	
	function updateLegendCount()
	{
		var count = Number(Player.playlistPosition) + 1;
		$('#playlistLegendLeft').html("Playing video " + count + " of "+Player.playlist.length);
	}

	/**
	 *	This method will generate the playlist
	 *	bed on the data returned from the 
	 *	playlist file defined in the configuration 
	 *  file
	 *
	 */
	function generatePlaylist()
	{
		var html = "<ul id=\"playlist\">";
			html += "<h1><u>Playlist</u></h1>";

		for (var i=0; i < Player.playlist.length; i++)
		{
			var v = new Object(Player.playlist[i]);
			html += "<li id='"+i+"' style=\"font-family:helvetica, arial;font-size:11px\">";
			html += v.title;
			html +="</li>";

			$('#'+i).live("click", function(event)
			{
				Player.playlistPosition = $(this).attr("id");
				// if a user selects an item from the playlist
				// we pass an optional paramter to the updatePlayer
				// method so the media item auto starts
   				updatePlayer(Player.playlist[$(this).attr("id")], true);
   			});
		}
		
		html += "<div id=\"playlistLegendContainer\"></div>";
		Player.playlistListenersAdded = true;
		return html;
	}

	/**
	 *	This method will log a message to the 
	 *  javascript console in Chrome, Firefox
	 *	and Safari.
	 *
	 *	@_str - string to log
	 */
	function log(_str)
	{
		if (Player.debugMode == true)
		{
			if (_str != null)
			{
				console.log(_str);
			}	
		}
	}

	window.Player = Player;
	
}(window));