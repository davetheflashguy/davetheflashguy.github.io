<?php


class ActivityController extends AppController {
	
	public $components = array('Session');
	public $uses = array('Activity', 'Customerkey','Solution');
	
	public function beforeFilter() {
		
    }
	
	public function index() {
		
		$this->layout = 'viewlayout';
		$data = $this->Activity->find('all');	
		$this->set('data', $data);
	
	}

	public function logdata($id = null, $key = null, $solutionid = null) {
		$this->layout = 'viewlayout';
		$activity = array(); 	
		
		$resource = $this->request->query['resource'];
		$this->log($key);
		$this->log($solutionid);
		$sessionid = $this->Session->id(session_id());
		if(empty($sessionid)) {
			$this->Session->start();
			$sessionid = $this->Session->id(session_id());
		} else {
			$solution = $this->Solution->find('first', array('conditions' =>array('id' => $solutionid)));
			$solutionName = $solution['Solution']['name'];
			$activity = $this->Activity->find('first', array('conditions'=> array('sessionid'=> $sessionid, 'solution_name' => $solutionName)));
	
		}
		
		$activity['Activity']['sessionid'] = $sessionid;
		$today = date("Y-m-d"); 	
		
		$solution = $this->Solution->find('first', array('conditions' =>array('id' => $solutionid)));
		$solutionName = $solution['Solution']['name'];
		
		$key = $this->Customerkey->find('first', array('condition' => array('id' => $key)));
		$keyName = $key['Customerkey']['accesskey'];
		
		$activity['Activity']['solution_name'] = $solutionName;
		$activity['Activity']['customerkey'] = $keyName;
		$activity['Activity']['date'] = $today;
		
		if(isset($id)) {			
			switch($id) {
				case 1:
	        	    $activity['Activity']['isDownload'] = 1;
	      			break;
	  		    case 2:
	  			    $activity['Activity']['isSlide'] = 1;
	   			    break;
			    case 3:
			        $activity['Activity']['isDemo'] = 1;
	    			break;
				case 4:
					$activity['Activity']['isEmail'] = 1;
			}
		}
		$this->Activity->save($activity);
		
		switch($id) {
			case 1:
	            header("Content-type:video/mp4");
				header("Content-Disposition:attachment;filename=" . $resource);
				readfile(MEDIABACKEND . $resource);
				die();
	      		break;
  		    case 2:
  			    
				$mimeTypes = array(
       			 	'pdf' => 'application/pdf',
      			  	'txt' => 'text/plain',
      			  	'html' => 'text/html',
       			 	'exe' => 'application/octet-stream',
        			'zip' => 'application/zip',
        			'doc' => 'application/msword',
       				'xls' => 'application/vnd.ms-excel',
      			  	'ppt' => 'application/vnd.ms-powerpoint',
       			 	'gif' => 'image/gif',
       			 	'png' => 'image/png',
       			 	'jpeg' => 'image/jpg',
       			 	'jpg' => 'image/jpg',
      			  	'php' => 'text/plain',
      			  	'zip' => 'application/zip'
    			);
				
				$fileName = 'test.zip';
				$parts = explode(".", $fileName);
				$fileExt = $parts[1];
				
				if(array_key_exists($fileExt, $mimeTypes)) {
                	$mimeType = $mimeTypes[$fileExt];
       			 } else {
                	$mimeType = 'application/force-download';
       			 }
				
				$this->log($mimeType);
				header("Content-type:application/zip");
				header("Content-Disposition:attachment;filename=" . $resource);
				readfile(MEDIABACKEND . $resource);
				die();
   			    break;
				
		    case 3:
				$url = urldecode($resource);
		        $this->redirect($url);
				die();
    			break;
			case 4:
				//$this->redirect("http://gmail.com");
				header("Location: mailto:wschweitzer00@gmail.com");
				die();
				break; 
			}
		
	}

	public function afterFilter() {
		//$this->Session->delete('Key');
	}
}
