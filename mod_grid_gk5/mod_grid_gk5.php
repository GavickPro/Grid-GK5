<?php

/**
* Grid GK5 - main PHP file
* @package Joomla!
* @Copyright (C) 2013 Gavick.com
* @ All rights reserved
* @ Released under GNU/GPL License : http://www.gnu.org/copyleft/gpl.html
* @ version $Revision: GK5 1.0 $
**/

// no direct access
defined('_JEXEC') or die;

define('DS', DIRECTORY_SEPARATOR);

// helper loading
require_once (dirname(__FILE__).DS.'helper.php');
// create class instance with params
$helper = new GridGK5Helper($module, $params); 
// creating HTML code	
$helper->render();

// EOF
