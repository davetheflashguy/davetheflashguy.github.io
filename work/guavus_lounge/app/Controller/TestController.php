<?php 
class TestController extends AppController {
	public function testo () {
		 $this->autoRender = false;
		
	/*	$this->response->header(array("Content-type"=>"video/mp4",
			"Content-Disposition"=>"attachment", "filename"=>'kumar.mp4'
		));
		*/
		header("Content-type:video/mp4");
		header("Content-Disposition:attachment;filename=kumar.mp4");
		readfile("/var/www/html/guavus/cakephp/app/webroot/media/kumar.mp4");
		
	}	
		
}
	