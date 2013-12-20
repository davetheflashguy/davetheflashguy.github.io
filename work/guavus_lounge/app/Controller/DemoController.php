<?php
class DemoController extends AppController {
	var $uses = array('Customerkey','Solution','Activity');
	public function indexold() {
		$this->layout = 'cda';
		$lhash = $this -> Session -> read('lhash');
		$accesskey = $lhash['accesskey'];
		$menuItems = $this->Customerkey->find('first',array('conditions'=>array('accesskey'=>$accesskey)));
		$menuItems = $menuItems['Solution'];
		$this->set('menuItems',$menuItems);
			
	}
	
	public function index() {
		$this->layout = 'cda';
		$lhash = $this -> Session -> read('lhash');
		$accesskey = $lhash['accesskey'];
		$customerkey = $this->Customerkey->find('first',array('conditions'=>array('accesskey'=>$accesskey)));
		$menuItems = $customerkey['Solution'];
		$this->set('menuItems',$menuItems);
		$this->set('accesskey',$customerkey['Customerkey']['accesskey']);	
		$this->set('customerkey_id',$customerkey['Customerkey']['id']);
		
	}
	
	public function beforeFilter() {
		if (!in_array($this->action,array('login','logout','test'),true)) {
			$lhash = $this -> Session -> read('lhash');
			if ($lhash == "") {
//				$this->Session->setFlash(__('Not logged in'));
				$this->redirect(array('action' => 'login'));		
			} else {
				if(strtotime($lhash['expiration_date']) < strtotime(date('Y-m-d')) ) {
					$this->Session->setFlash(__('The key has Expired'));
					$this -> Session -> destroy();	
					$this->redirect(array('action' => 'login'));		
				
				}
			}
		}
	}
		
	public function login()  {
		$this->layout = 'cda';

		if ($this->request->is('post')) {
			$accesskey = trim($this->request['data']['login']['key']);
			$customerkey = $this->Customerkey->find('first',array('conditions'=>array('accesskey'=>$accesskey)));
	
			if ($customerkey) {
				$cdate = $customerkey['Customerkey']['expires'];
				
				
				if(strtotime($cdate) < strtotime(date('Y-m-d')) ) {
					$this->Session->setFlash(__('This key has expired'));
					$this->redirect(array('action' => 'login'));		
					
				} else {
					$this->Session->write('lhash',
					array('accesskey'=>$customerkey['Customerkey']['accesskey'],
					 'expiration_date'=>$customerkey['Customerkey']['expires']						
					));
					$this->redirect(array('action' => 'index'));
				}
				
		
			} else {
				$this->Session->setFlash(__('Invalid key'));	
				$this->redirect(array('action' => 'login'));		
							
			}				
		}
	}
	
	public function solution($id) {
		#need to work on not displaying solutions  for not valid customers
		
		$this->layout = 'cda';
		$solution = $this->Solution->find('first',array('id'=>$id));
		$this->set('solution',$solution);
		

		#hardcoded customerkey
		$customerkey_id = 1;
		#find menu items.
		
		$menuItems = $this->Customerkey->find('first',array('id'=>$id));
		$menuItems = $menuItems['Solution'];
		$this->set('menuItems',$menuItems);
		
		
		
	}
		
	public function processactivity() {
		$this->layout = 'ajax';	
		$today = date("Y-m-d"); 		
		if ($this->request->is('post')) {	
			$dat = $this->request->data;
			$arr = array('isDownload','isSlide','isDemo','isEmail');
			$accesskey =$dat['accesskey'];
			$solution = $dat['solution'];
			$today = date("Y-m-d"); 		
			$activity = $this->Activity->find('first',array('conditions'=>
			array('accesskey'=>$accesskey,
			'solution'=>$solution,'date'=>$today)));
			if ($activity) {
				$id = $activity['Activity']['id'];
				$this->Activity->read(null,$id);
				
			//	$this->Activity->id = $id;
				foreach ($arr as $item) {
					if ($dat[$item] ==1) {
						$count = $this->Activity->data['Activity'][$item];
						if ($count != "") {
							$count = $count +1;
							
							
						} else {
							$count = 1;
						}
						$this->Activity->set($item,$count);
					}
				}
				$this->Activity->save();
			} else {
				$dat['date'] = $today;
				$this->Activity->create();
				$this->Activity->save(array('Activity'=>$dat));
				
			}
		
        } 		
	}
	
	public function test() {
		
		$this->controller->autoRender = false;
		header("Content-type:video/mp4");
		header("Content-Disposition:attachment;filename=kumar.mp4");
		readfile("/var/www/html/guavus/cakephp/app/webroot/media/kumar.mp4");
	
	}	

}