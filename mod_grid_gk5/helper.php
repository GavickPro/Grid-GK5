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
	private $tabs; // array of tabs content
	private $mod_getter; // object to get the modules
	private $active_tab; // number of the active tab
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
		// initializing the tabs array
		$this->tabs = array(
								"content" => array(),
								"title" => array(),
								"type" => array(),
								"id" => array(),
								"animation" => array()
							);
		// getting module ID
		$this->config['module_id'] = ($this->config['automatic_module_id'] == 1) ? 'gk-tabs-' . $module->id : $params->get('module_id', 'gk-tabs-1');
		// check the data source type
		if($this->config['module_data_source'] == 'tabsmanager') {
			// parse JSON data if it comes from the tabs manager
			$this->config['tabs_data'] = json_decode($this->config['tabs_data']);
		}
	}
	// function to render module code
	public function render() {
		if(count($this->config['tabs_data']) == 0) {
			echo JText::_('mod_grid_gk5_NO_TABS_TO_SHOW');
			return false;
		}
		// get the user access levels
		$access = JAccess::getAuthorisedViewLevels(JFactory::getUser()->get('id'));
		// remove the unpublished or invisible for specified user tabs and put only necessary tabs
		for($i = 0; $i < count($this->config['tabs_data']); $i++) {
			if($this->config['tabs_data'][$i]->published == 1 && ($this->checkAccess($this->config['tabs_data'][$i]->access, $access))) {
				// parse plugins code in the tab XHTML content
				if($this->config['parse_plugins'] == 1) {
					$this->config['tabs_data'][$i]->content = JHtml::_('content.prepare', $this->config['tabs_data'][$i]->content);
				}
				// put the data to specific array
				array_push($this->tabs["title"], $this->config['tabs_data'][$i]->name);
				array_push($this->tabs["content"], $this->config['tabs_data'][$i]->content);
				array_push($this->tabs["type"], $this->config['tabs_data'][$i]->type);
				array_push($this->tabs["id"], $this->config['tabs_data'][$i]->id);
				array_push($this->tabs["animation"], $this->config['tabs_data'][$i]->animation);
			}
		}
		// create necessary instances of the Joomla! classes 
		$document = JFactory::getDocument();
		$uri = JURI::getInstance();
		// add stylesheets to document header
		if($this->config["useCSS"] == 1) {
			$document->addStyleSheet( $uri->root().'modules/mod_grid_gk5/styles/'.$this->config['styleCSS'].'.css', 'text/css' );
		}
		// get active tab:
		$uri_id_fragment = '';
		// puth height CSS rules
		$document = JFactory::getDocument();
		$document->addStyleDeclaration('#'.$this->config['module_id'].' .gkTabsContainer0, #'.$this->config['module_id'].' .gkTabsContainer1, #'.$this->config['module_id'].' .gkTabsContainer2 { height: '.$this->config['module_height'].'px; }');
		// if url selection is enabled
		if($this->config['url_tab_selection'] == 1) {
			if($uri->getVar('gktab', '') != '') {
				$this->active_tab = (int) $uri->getVar('gktab', '');
			}
		}	
		// if cookie selection is enabled
		if($this->config['cookie_tab_selection'] == 1) {
			if(isset($_COOKIE['gktab-' . $this->config['module_id']])) {
				$this->active_tab = (int) $_COOKIE['gktab-' . $this->config['module_id']];
			}
		}
		// check the active_tab value
		if($this->active_tab > count($this->config['tabs_data'])) {
			$this->active_tab = 1;
		}
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
		// generate GK Tab configuration array
		$config_data = array(
			"activator" =>			$this->config['activator'],
			"animation" =>			$this->config['animation'],
			"animation_speed" => 	$this->config['animation_speed'],
			"animation_interval" =>	$this->config['animation_interval'],
			"animation_type" =>		$this->config['animation_type'],
			"animation_function" => $this->config['animation_function'],
			"active_tab" =>			$this->active_tab,
			"cookie_save" => 		$this->config['cookie_tab_selection'],
			"auto_height" =>		($this->config['tabs_position'] == 'left' || $this->config['tabs_position'] == 'right') ? 0 : $this->config['module_auto_height'],
			"module_height" =>		$this->config['module_height'],
			"rtl" => $this->config['rtl']
		);
		// store it as JSON
		$config_data = str_replace('"', '\'', json_encode($config_data));
		//
		if($this->config['tabs_position'] == 'left' || $this->config['tabs_position'] == 'right') {
			$document->addStyleDeclaration('#'.$this->config['module_id'].' .gkTabsWrap > ol { width: '.$this->config['tabs_width'].'px; }'. "\n");
		}
		// override styles for RTL
		if($this->config['rtl'] == 1) {
			$document->addStyleDeclaration('.gkTabsItem.active { left: auto; right: 0; }'."\n");
			$document->addStyleDeclaration('.gkTabsItem { left: auto; right: -9999px; }'."\n");
		}
		// include main module view
		require(JModuleHelper::getLayoutPath('mod_grid_gk5', 'default'));
	}
	// function to generate the module tabs
	public function moduleRender() {		
		// iterate all tabs
		for($i = 0; $i < count($this->tabs["content"]); $i++) {
			// check if selected tab is active
			$active_class = ($this->active_tab == $i + 1) ? ' active' : '';
			// if the tab contains the module
			if($this->tabs["type"][$i] == 'module') {
				$this->mod_getter = JModuleHelper::getModules($this->tabs["content"][$i]);
				require(JModuleHelper::getLayoutPath('mod_grid_gk5','module'));
			}
			// tabs with XHTML code
			if($this->tabs["type"][$i] == 'xhtml') {
				$content = $this->tabs["content"][$i];
				require(JModuleHelper::getLayoutPath('mod_grid_gk5','xhtml'));
			}
		}
	}
	// function to check the tab access levels
	private function checkAccess($tabACL, $userACL) {
		// cast to integer
		$tabACL = (int) $tabACL;
		// if the user have priviliges return true
		if(in_array($tabACL, $userACL)) {
			return true;
		}
		// in other way return false
		return false;
	}
}
// helper class to create objects from XML
if(!class_exists('GKTabObject')) {
	class GKTabObject {
		public $name;
		public $type;
		public $content;
		public $published;
		public $access;
		public $id;
		public $animation;
		
		function __construct($name, $type, $content, $published, $access, $id, $animation) {
			$this->name = $name;
			$this->type = $type;
			$this->content = $content;
			$this->published = $published;
			$this->access = $access;
			$this->id = $id;
			$this->animation = $animation;
		}
	}
}

// EOF