<?php 	
class SolutionsController extends AppController {
	public function beforeFilter() {
		$this->layout = 'admin';
    }
	
	private function handleCheckBox () {
		if (is_array($this->request->data['Solution']['products'])) {
		$this->request->data['Solution']['products'] = implode(',',$this->request->data['Solution']['products']);
	
		}
	}	
	private function getCategories() {
		$this->Solution->recursive = 0;
		
		$array = $this->Solution->find('all',array('fields'=>'DISTINCT category','conditions' => array("not" => array ( "category" => null)),'order'=>array('category')));
		return "[".implode(",",array_map(
			function($var){return "'".$var['Solution']['category']."'";
		},$array))."]";
	}

	
	private function uploadFile($field) {
		$target = MEDIABACKEND;
		$fileArray = $this->request->data['Solution'][$field];		
		//exit();
		if ($fileArray['error'] > 0) {
			$this->Solution->validationErrors[$field] = "Submit a file please";
		} else {
			//$now = date('Y-m-d-His');
			$filename = $fileArray['name'];
			var_dump($filename)
			move_uploaded_file($fileArray['tmp_name'],
			$target.$filename);
			
			$this->request->data['Solution'][$field.'_name'] = $filename;
			$this->request->data['Solution'][$field.'_type'] = $fileArray['type'];
	
			return true;
			
		}		
	}
	
    public function index() {
		
       // $this->Solution->recursive = 0;
       // $this->set('solutions', $this->paginate());
       //$this->layout = 'lame2';
        $solutions = $this->Solution->find('all');
		$this->layout = 'viewlayout';
        $this->set('solutions', $solutions);
    }

    public function view($id = null) {
        $this->Solution->id = $id;
        if (!$this->Solution->exists()) {
            throw new NotFoundException(__('Invalid solution'));
        }
        $this->set('user', $this->User->read(null, $id));
    }

    public function add() {
    	$this->layout = 'viewlayout';
    	$this->Solution->recursive = 0;
        $this->set('solutions', $this->paginate());
		$this->set('jscatarray',$this->getCategories());
		
	//	$products = $this->Solution->Product->find('list');
	//	$this->set(compact('products'));
		
        if ($this->request->is('post')) {	
			$solution = $this->request->data;
			var_dump($solution);
			$videoFile = $solution['Solution']['video']['name'];
			$slideFile = $solution['Solution']['slide']['name'];
			
			$solution['Solution']['video_name'] = $videoFile;
			$solution['Solution']['slide_name'] = $slideFile;
			
			// TODO: setup solution to products association
		//	if (is_array($solution['Solution']['products'])) {
      	//		$solution['Solution']['products'] = implode(',',$solution['Solution']['products']);
		//	}		
			
			$this->Solution->set($solution);
            if ($this->Solution->validates()) {
            	$this->handleCheckBox();
				$this->uploadFile('video');
				$this->uploadFile('slide');
				$this->Solution->save($solution);			
               	$this->Session->setFlash(__('The Solution has been saved'));
               	$this->redirect(array('action' => 'index'));
			} else {
                $this->Session->setFlash(__('The solution could not be saved. Please, try again.'));
            }
        } 
    }

    public function edit($id = null) {
    	
		$this->layout = 'viewlayout';
    	$this->Solution->recursive = 0;
        $this->Solution->id = $id;
		$this->set('jscatarray',$this->getCategories());
		
        if (!$this->Solution->exists()) {
            throw new NotFoundException(__('Invalid solution'));
        }
	
        if ($this->request->is('post') || $this->request->is('put')) {
        	
			$solution = $this->request->data;
			$slideArr = $this->request->data['Solution']['slide'];		
			$videoArr = $this->request->data['Solution']['video'];
			
			$slideFileName = $slideArr['name'];
			$videoFileName = $videoArr['name'];
			
			if (!empty($slideFileName)) {
				$solution['Solution']['slide_name'] = $slideFileName;
			}
			
			if(!empty($videoFileName)) {
				$solution['Solution']['video_name'] = $videoFileName;
			}
			
        	$this->Solution->set($solution);
			
            if ($this->Solution->validates()) {
    			$this->uploadFile('video');
				$this->uploadFile('slide');
				$this->handleCheckBox();
				$this->Solution->save($solution);
                $this->Session->setFlash(__('The customer key has been saved'));
                $this->redirect(array('action' => 'index'));
                //$this->redirect(array('action' => 'edit',$id));
                
            } else {
				
                $this->Session->setFlash(__('The solution could not be saved. Please, try again.'));
            }
        } else {
            $this->request->data = $this->Solution->read(null, $id);
			//$this->request->data['Solution']['products'] = explode(",",$this->request->data['Solution']['products']);
        }
    }

    public function delete($id = null) {
        if (!$this->request->is('post')) {
            throw new MethodNotAllowedException();
        }
        $this->Solution->id = $id;
        if (!$this->Solution->exists()) {
            throw new NotFoundException(__('Invalid user'));
        }
        if ($this->Solution->delete()) {
            $this->Session->setFlash(__('Solution deleted'));
            $this->redirect(array('action' => 'index'));
        }
        $this->Session->setFlash(__('Solution was not deleted'));
        $this->redirect(array('action' => 'index'));
    }
}