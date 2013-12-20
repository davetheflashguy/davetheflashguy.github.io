<?php
// app/Model/CustomerKeys.php
class Customerkey extends AppModel {
    public $name = 'Customerkey';
	public $hasAndBelongsToMany = array(
	 	'Solution' =>
	 		array(
				'className' => 'Solution',
				'joinTable' => 'customer_solutions',
				'foreignKey' => 'customerkey_id',
				'associatingForeignKey' => 'solution_id',
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
	
    public $validate = array(
        'customer' => array(
            'required' => array(
                'rule' => array('notEmpty'),
                'message' => 'A customer is required'
            )
        ),
        'accesskey' => array(
            'required' => array(
                'rule' => array('notEmpty'),
                'message' => 'A key is required'
            ),
            'unique' => array(
        		'rule' => 'isUnique',
        		'message' => 'That key already exists. Please enter a unique key.'),
        	'maxlength' => array(
				'rule' => array('maxLength',40),
				'message' => 'Accesskey must not be longer than 40'
			)
        ),
        'Product' => array(
               'multiple' => array(
                'rule' => array('multiple',array('min' => 1)),
                'message' => 'Please select at least 1 category')
            
        ),
        'expires' => array(
            'required' => array(
                'rule' => array('notEmpty'),
                'message' => 'A expiration date is required'
            )
        )
    );
}