var WKIPAD = WKIPAD || {};

WKIPAD.Config = {
	// Base url for application
	APP_URL: "http://wkipad.azurewebsites.net/aan-family/",

	// App title (shows in the top header)
	PUBLICATION_TITLE: "American Academy of Neurology Publications",
	
	// Used to get the folios when testing on the desktop since the API is not available.
	FULFILLMENT_URL: "http://edge.adobe-dcfs.com/ddp/issueServer/issues?accountId=88874449cd6e409da3f4158e418fdb59",

	// folio list
	FOLIO_LIST: ["Continuum", "Neurology: Clinical Practice", "Neurology", "Neurology Today", "Neurology Now"],
	

	// the default folio
	FOLIO_DEFAULT: 2,

	// preloader top
	TOP_LIBRARY_PRE_LOADER_IMAGE: "http://wkipad.azurewebsites.net/aan-family/loader.gif",
	TOP_LIBRARY_PRE_LOADER_IMAGE_WIDTH: 50,
	TOP_LIBRARY_PRE_LOADER_IMAGE_HEIGHT: 50,

	// preloader middle
	MIDDLE_LIBRARY_PRE_LOADER_IMAGE: "http://wkipad.azurewebsites.net/aan-family/loader.gif",
	MIDDLE_LIBRARY_PRE_LOADER_IMAGE_WIDTH: 50,
	MIDDLE_LIBRARY_PRE_LOADER_IMAGE_HEIGHT: 50,	

	// preloader bottom
	BOTTOM_LIBRARY_PRE_LOADER_IMAGE: "http://wkipad.azurewebsites.net/aan-family/loader.gif",
	BOTTOM_LIBRARY_PRE_LOADER_IMAGE_WIDTH: 50,
	BOTTOM_LIBRARY_PRE_LOADER_IMAGE_HEIGHT: 50,	

	BOTTOM_LIBRARY_IMAGE_WIDTH: 90,
	BOTTOM_LIBRARY_IMAGE_HEIGHT: 120,

	// preloader library detail page
	DETAIL_LIBRARY_PRE_LOADER_IMAGE: "http://wkipad.azurewebsites.net/aan-family/loader.gif",
	DETAIL_LIBRARY_PRE_LOADER_IMAGE_WIDTH: 50,
	DETAIL_LIBRARY_PRE_LOADER_IMAGE_HEIGHT: 50,	

	DETAIL_LIBRARY_IMAGE_WIDTH: 220,
	DETAIL_LIBRARY_IMAGE_WIDTH: 295,

	// remove folios page
	REMOVE_FOLIO_PRE_LOADER_IMAGE: "http://wkipad.azurewebsites.net/aan-family/loader.gif",
	REMOVE_FOLIO_PRE_LOADER_IMAGE_WIDTH: 50,
	REMOVE_FOLIO_PRE_LOADER_IMAGE_HEIGHT: 50,	

	REMOVE_FOLIO_IMAGE_WIDTH: 220,
	REMOVE_FOLIO_IMAGE_WIDTH: 295,

	// Library Preloader Image
	PRE_LOADER_IMAGE: "loader.gif",

	// Large library cover dimensions
	LARGE_COVER_WIDTH: 350,
	LARGE_COVER_HEIGHT: 460,

	// Right margin for the large library covers
	LARGE_COVER_MARGIN_RIGHT: 45,

	// Opacity for deselected items
	LARGE_LIBRARY_ALPHA_FADE: .4,

	// Scale speed for top library items (milliseconds)
	LARGE_LIBRARY_TRANSITION_SPEED: 200,

	// Top library cover dimensions
	TOP_LIBRARY_COVER_WIDTH: 120,
	TOP_LIBRARY_COVER_HEIGHT: 160,

	// Right margin for the large library covers
	TOP_LIBRARY_COVER_MARGIN_RIGHT: 25,

	// Scale size for top library items
	TOP_LIBRARY_SCALE: 1.075,

	// Opacity for deselected items
	TOP_LIBRARY_ALPHA_FADE: .4,

	// Scale speed for top library items (milliseconds)
	TOP_LIBRARY_TRANSITION_SPEED: 200,

	// how many covers we want to show on the bottom
	MAX_BOTTOM_LIBRARY_COVERS: 7,

	// Right margin for the large library covers
	BOTTOM_LIBRARY_COVER_MARGIN_RIGHT: 34,

    // Minimum number of issues on All Issues Page
	MINIMUM_ISSUES_ON_PAGE: 12,

    CUSTOM_INSTRUCTIONS:"AAN Members: please sign in with your AAN member credentials. New members should <a class=\"custom-instructions-link\" target=\"_blank\" href=\"javascript:adobeDPS.dialogService.open('http://journals.lww.com/_layouts/DPS/Register.aspx?journalid=neurology\')\">create an account</a>. If you have a username and password for LWW journals, please enter those credentials. If you need assistance with access or downloading issues, please call 1-866-489-0443 (outside North America call 1-301-223-2300) or e-mail <a class=\"custom-instructions-link\"  target=\"_blank\" href=\"mailto:memberservice@lww.com\">Customer Service</a>",

}