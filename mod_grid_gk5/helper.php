<?php

/**
* Helper class for Grid GK5 module
*
* GK Grid
* @package Joomla!
* @Copyright (C) 2013 Gavick.com
* @ All rights reserved
* @ Released under GNU/GPL License : http://www.gnu.org/copyleft/gpl.html
* @ version $Revision: GK5 1.0 $
**/

// access restriction
defined('_JEXEC') or die('Restricted access');
// import JString class for UTF-8 problems
jimport('joomla.utilities.string'); 
// Main GK Tab class
class GridGK5Helper {
	private $config; // configuration array
	private $mod_getter; // object to get the modules
	// constructor
	public function __construct($module, $params) {
		// put the module params to the $config variable
		$this->config = $params->toArray();
        // if the user set engine mode to Mootools
        if($this->config['engine_mode'] == 'mootools') {
            // load the MooTools framework to use with the module
            JHtml::_('behavior.framework', true);
        } else if($this->config['include_jquery'] == 1) {
            // if the user specify to include the jQuery framework - load newest jQuery 1.7.* 
            $doc = JFactory::getDocument();
            // generate keys of script section
            $headData = $doc->getHeadData();
            $headData_keys = array_keys($headData["scripts"]);
            // set variable for false
            $engine_founded = false;
            // searching phrase mootools in scripts paths
            if(array_search('https://ajax.googleapis.com/ajax/libs/jquery/1.10/jquery.min.js', $headData_keys) > 0) {
                $engine_founded = true;
            }
            //
            if(!$engine_founded) {
                $doc->addScript('https://ajax.googleapis.com/ajax/libs/jquery/1.10/jquery.min.js');
            }
        }
		// getting module ID
		$this->config['module_id'] = ($params->get('module_id', '') == '') ? 'gk-grid-' . $module->id : $params->get('module_id', '');
		// parse JSON data which comes from the grid manager
		$this->config['grid_data'] = json_decode($this->config['grid_data']);
	}
	// function to render module code
	public function render() {
		if(is_array($this->config['grid_data']) && count($this->config['grid_data']) == 0) {
			echo JText::_('MOD_GRID_NO_BLOCKS');
			return false;
		}
		// create necessary instances of the Joomla! classes 
		$document = JFactory::getDocument();
		$uri = JURI::getInstance();
		// add stylesheets to document header
		if($this->config["useCSS"] == 1) {
			$document->addStyleSheet( $uri->root().'modules/mod_grid_gk5/styles/style.css', 'text/css' );
		}
		// put the generated CSS rules to head
		$document = JFactory::getDocument();
		$document->addStyleDeclaration($this->moduleCSS());
		// getting module head section datas
		$headData = $document->getHeadData();
		// generate keys of script section
		$headData_keys = array_keys($headData["scripts"]);
		// set variable for false
		$engine_founded = false;
		// searching phrase mootools in scripts paths
		if(array_search($uri->root().'modules/mod_grid_gk5/scripts/engine.'.($this->config['engine_mode']).'.js', $headData_keys) > 0) {
			// if founded set variable to true
			$engine_founded = true;
		}
		// if engine file doesn't exists in document head section
		if(!$engine_founded || $this->config['useScript'] == 1) {
			// add new script tag connected with mootools from module
			$document->addScript($uri->root().'modules/mod_grid_gk5/scripts/engine.'.($this->config['engine_mode']).'.js');
		}
		// include main module view
		//require(JModuleHelper::getLayoutPath('mod_grid_gk5', 'default'));
	}
	// function to generate the module grid elements
	public function moduleRender() {		
		// iterate all grid elements
		for($i = 0; $i < count($this->config["grid_data"]); $i++) {
			// render the specific blocks
			$this->mod_getter = JModuleHelper::getModules($this->config["grid_data"][$i]);
			require(JModuleHelper::getLayoutPath('mod_grid_gk5','module'));
		}
	}
	// function to generate the module CSS code
	public function moduleCSS() {
		// prepare the helper variables
		$prefix = '#'.$this->config['module_id'].' .gkGridElement.gkGrid-';
		$output_desktop = '';
		$output_tablet = '';
		$output_mobile = '';
		// ge the grid settings
		$block_data = $this->config['grid_data']->blocks;
		$mod_height_desktop = $this->config['grid_data']->heights->desktop;
		$mod_height_tablet = $this->config['grid_data']->heights->tablet;
		$mod_height_mobile = $this->config['grid_data']->heights->mobile;
		// define the blocks border
		$output_desktop .= '#'.$this->config['module_id'].' .gkGridElement { border: ' . $this->config['grid_border'] . '; }' . "\n";
		// define the blocks size and position
		for($i = 0; $i < count($block_data); $i++) {
			$el = $block_data[$i];
			$output_desktop .= $prefix . $el->ID . ' { height: '.($el->SIZE_D_H * (100.0 / $mod_height_desktop)).'%; width: '.($el->SIZE_D_W * (100.0 / 6)).'%; left: '.($el->POS_D_X * (100.0 / 6)).'%; top: '.($el->POS_D_Y * (100.0 / $mod_height_desktop)).'%; }' . "\n";
			$output_tablet .= $prefix . $el->ID . ' { height: '.($el->SIZE_T_H * (100.0 / $mod_height_tablet)).'%; width: '.($el->SIZE_T_W * (100.0 / 6)).'%; left: '.($el->POS_T_X * (100.0 / 6)).'%; top: '.($el->POS_T_Y * (100.0 / $mod_height_tablet)).'%; }' . "\n";
			$output_mobile .= $prefix . $el->ID . ' { height: '.($el->SIZE_M_H * (100.0 / $mod_height_mobile)).'%; width: '.($el->SIZE_M_W * (100.0 / 6)).'%; left: '.($el->POS_M_X * (100.0 / 6)).'%; top: '.($el->POS_M_Y * (100.0 / $mod_height_mobile)).'%; }' . "\n";
		}
		// output the final CSS code
		return $output_desktop . '@media (max-width: '.$this->config['tablet_width'].'px) { ' . "\n" . $output_tablet . '} ' . "\n" . '@media (max-width: '.$this->config['mobile_width'].'px) { ' . "\n" . $output_mobile . '} ';
	}
}

// EOF