<?php
/**
 * Application level View Helper
 *
 * This file is application-wide helper file. You can put all
 * application-wide helper-related methods here.
 *
 * PHP 5
 *
 * CakePHP(tm) : Rapid Development Framework (http://cakephp.org)
 * Copyright 2005-2012, Cake Software Foundation, Inc. (http://cakefoundation.org)
 *
 * Licensed under The MIT License
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright 2005-2012, Cake Software Foundation, Inc. (http://cakefoundation.org)
 * @link          http://cakephp.org CakePHP(tm) Project
 * @package       app.View.Helper
 * @since         CakePHP(tm) v 0.2.9
 * @license       MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

App::uses('Helper', 'View');

/**
 * Application helper
 *
 * Add your application-wide methods in the class below, your helpers
 * will inherit them.
 *
 * @package       app.View.Helper
 */
class AppHelper extends Helper {
	function displayCustomerIndexProducts($solutions) {
		$groups = array();
		$count = array();
		$disp = "";
		foreach ($solutions as $solution) {
			$key = $solution['product'];
			if (array_key_exists($key,$groups) ) {
				$groups[$key] .= "<li>".$solution['name']."</li>";
				$count[$key] += 1;
			} else {
				$groups[$key] = "<li>".$solution['name']."</li>";
				$count[$key] = 1;
			}		
		}
		$keys = array_keys($groups);
		foreach ($keys as $key) {
			$disp .= "<div class='prod-group'>
						<a href='#' class='product-expand'>$key</a>($count[$key])
						<ul class='prod-items'>$groups[$key]</ul>
					</div>";
		}
		return $disp;
	}
	
}
