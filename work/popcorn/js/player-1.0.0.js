

(function(window)
{
	// public reference (to this class) of the popcorn framework
	Player.popcorn = null;
	// public reference (to this class) of the current media item's metadata object see @getVideoMetaData()
	Player.currentMetaDataObj = null;
	// Reference to parent html element
	Player.parentDivReference = null;

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
	 * 	@_whats-playing reference to the what's playing div on the DOM
	 *	@_videoContainer reference to a div on the DOM
	 */
	Player.prototype.embedPlayer = function(_videoContainer, _videoUri)
	{
		Player.popcorn = Popcorn(Player.parentDivReference);
		video = document.getElementsByTagName("video")[0];  
		// get the first video object
		updatePlayer(_videoUri);
		video.addEventListener("canplay", onCanPlay);
		video.addEventListener("durationchange", onDurationChange);
		video.addEventListener("loadedmetadata", onLoadedMetaData);
		video.addEventListener("pause", onPause);
		video.addEventListener("play", onPlay);
		video.addEventListener("playing", onPlaying);
		video.addEventListener("progress", onProgress);
		video.addEventListener("volumechange", onVolumeChange);
		video.addEventListener("seeked", onMediaSeek);
		video.addEventListener("ended", onComplete);
	}

	/**
	 *	This method is the only method that updates the player.
	 *	Call this when the player should update it's media.
	 *	By default embedPlayer method calls this function
	 *	The first time the page loads.
	 * 
	 * 	@_src video uri
	 */	
	function updatePlayer(_vidUri)
	{
		console.log('_vidUri: ' + _vidUri);
		video.src = _vidUri;
	}


	Player.prototype.pauseVideo = function()
	{
		video.pause();
	}

	Player.prototype.resumeVideo = function()
	{
		video.resumeVideo();
	}
	// toggle's on it's own
	Player.prototype.togglePlayback = function()
	{
		(video.playing) ? video.pause : video.resumeVideo;
	}

	Player.prototype.restartVideo = function()
	{
		video.restartVideo();
	}
	

	/**
	 *	Get the meta data from the video and
	 *	sets the public metadata objects properties
	 * 
	 */	
	function getVideoMetaData()
	{
		if (Player.popcorn.media.readyState >= 2) 
		{
			var videoObj = new Object();
				videoObj.duration = Player.popcorn.duration();
				videoObj.width = Player.popcorn.media.width;
				videoObj.height = Player.popcorn.media.height;
			currentMetaDataObj = videoObj;
		}
		else 
		{
        	setTimeout(getVideoMetaData, 10);
        }
		
	}

	/**
	 *	Sent when enough data is available that the 
	 *  media can be played, at least for a couple of 
	 *  frames.  This corresponds to the CAN_PLAY readyState.
	 * 
	 */	
	function onCanPlay(e)
	{
		// for right now do nothing
	}

	/**
	 *	The metadata has loaded or changed, indicating a 
	 *	change in duration of the media.  This is sent, 
	 *	for example, when the media has loaded enough that 
	 *	the duration is known.
	 * 
	 */	
	function onDurationChange(e)
	{
		// for right now do nothing
	}

	/**
	 *	The media's metadata has finished loading; all 
	 *	attributes now contain as much useful information 
	 *	as they're going to.
	 * 
	 */	
	function onLoadedMetaData(e)
	{
		// when the meta data is loaded get it
		getVideoMetaData();
	}

	/**
	 *	Sent when playback is paused.
	 * 
	 */	
	function onPause(e)
	{
		console.log('onPause' + e); 
	}

	/**
	 *	Sent when playback is paused.
	 * 
	 */	
	function onPlay(e)
	{
		console.log('onPlay' + e); 
	}

	/**
	 * Sent when playback of the media starts after having
	 * been paused; that is, when playback is resumed after 
	 * a prior pause event.
	 * 
	 */		
	function onPlaying(e)
	{
		console.log('onPlaying' + e); 
	}

	/**
	 *	Sent periodically to inform interested parties of 
	 *	progress downloading the media. Information about 
	 *	the current amount of the media that has been downloaded 
	 *	is available in the media element's buffered attribute.
	 * 
	 */	
	function onProgress(e)
	{
		console.log('onProgress' + e); 
	}

	/**
	 *	Sent when the audio volume changes (both when the 
	 *  volume is set and when the muted attribute is changed).
	 * 
	 */	
	function onVolumeChange(e)
	{
		console.log('onVolumeChange' + e); 
	}

	/**
	 *	Sent when a seek operation completes.
	 * 
	 */	
	function onMediaSeek(e)
	{
		console.log('onMediaSeek' + e); 
	}

	/**
	 *	Sent when a seek operation completes.
	 * 
	 */	
	function onMediaSeek(e)
	{
		console.log('on seek called from: ' + e.target); 
	}

	/**
	 *	Sent when playback completes.
	 * 
	 */
	function onComplete(e)
	{
		console.log('the video has completed')
	}

	window.Player = Player;
	
}(window));