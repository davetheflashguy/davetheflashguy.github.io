<?php

class Product extends AppModel {
	public $name = 'Product';	
	public $hasAndBelongsToMany = array(
	 	'Customerkey' =>
	 		array(
				'className' => 'Customerkey',
				'joinTable' => 'customer_products',
				'foreignKey' => 'product_id',
				'associatingForeignKey' => 'customerkey_id',
				'unique' => true,
				'conditions'             => '',
                'fields'                 => '',
                'order'                  => '',
                'limit'                  => '',
                'offset'                 => '',
                'finderQuery'            => '',
                'deleteQuery'            => '',
                'insertQuery'            => ''
			
			)		
	);
	
}
	