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
            if(array_search('https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js', $headData_keys) > 0) {
                $engine_founded = true;
            }
            //
            if(!$engine_founded) {
                $doc->addScript('https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js');
            }
        }
		// getting module ID
		$this->config['module_id'] = ($params->get('module_id', '') == '') ? 'gk-grid-' . $module->id : $params->get('module_id', '');
		// parse JSON data which comes from the grid manager
		$this->config['grid_data'] = json_decode($this->config['grid_data']);
	}
	// function to render module code
	public function render() {
		if(is_array($this->config['grid_data']) && count($this->config['grid_data']->blocks) == 0) {
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
		require(JModuleHelper::getLayoutPath('mod_grid_gk5', 'default'));
	}
	// function to generate the module grid elements
	public function moduleRender() {
		$amount = count($this->config["grid_data"]->blocks);		
		if($amount > 0) {
			// iterate all grid elements
			for($i = 0; $i < $amount; $i++) {
				$item = $this->config["grid_data"]->blocks[$i];
				$position = trim($this->config["grid_data"]->blocks[$i]->POSITION);
				$num = 1;

				if(substr($position, -1) == ']') {
					$num = $position;
					$position = substr($position, 0, stripos($position, '['));
					$num = str_replace(array('[', ']', $position), '', $num);

					if(is_numeric($num)) {
						$num = $num * 1;
					} else {
						$num = 1;
					}
				}
				// render the specific blocks
				echo '<div class="gkGridElement gkGrid-'.str_replace(array('[', ']'), array('_', ''), $item->ID).(($this->config['animation'] == 0) ? ' active' : '').'">';

				$this->mod_getter = JModuleHelper::getModules($position);

				if(is_array($this->mod_getter) && count($this->mod_getter) > 0) {
					$iterator = 0;
					$founded = false;
					foreach(array_keys($this->mod_getter) as $m) { 
						if($iterator == $num - 1) {
							echo JModuleHelper::renderModule($this->mod_getter[$m]); 
							$founded = true;
							break;
						}

						$iterator++;
					}

					if(!$founded) {
						echo '<strong>Error:</strong> Specified module on the used module position doesn\'t exist!';
					}
				} else {
					echo '<strong>Error:</strong> Specified module position doesn\'t exist or is blank!';
				}
				echo '</div>';
			}
		} else {
			echo '<strong>Error:</strong> You didn\'t specified any blocks to display!';
		}

		return $amount > 0;
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
		$output_desktop .= '#'.$this->config['module_id'].' .gkGridElement { border: ' . $this->config['grid_border'] . '; }' . "\n" . '.gkGridGK5 .gkImgDesktop { display: block; } .gkGridGK5 .gkImgTablet, .gkGridGK5 .gkImgMobile { display: none; } ' . "\n" ;
		// define the blocks size and position
		for($i = 0; $i < count($block_data); $i++) {
			$el = $block_data[$i];
			$output_desktop .= $prefix . str_replace(array('[', ']'), array('_', ''), $el->ID) . ' { height: '.($el->SIZE_D_H * (100.0 / $mod_height_desktop)).'%; width: '.($el->SIZE_D_W * (100.0 / 6)).'%; left: '.($el->POS_D_X * (100.0 / 6)).'%; top: '.($el->POS_D_Y * (100.0 / $mod_height_desktop)).'%; z-index: '.($i+1).'; }' . "\n";
			$output_tablet .= $prefix . str_replace(array('[', ']'), array('_', ''), $el->ID) . ' { height: '.($el->SIZE_T_H * (100.0 / $mod_height_tablet)).'%; width: '.($el->SIZE_T_W * (100.0 / 4)).'%; left: '.($el->POS_T_X * (100.0 / 4)).'%; top: '.($el->POS_T_Y * (100.0 / $mod_height_tablet)).'%; z-index: '.($i+1).'; }' . "\n";
			$output_mobile .= $prefix . str_replace(array('[', ']'), array('_', ''), $el->ID) . ' { height: '.($el->SIZE_M_H * (100.0 / $mod_height_mobile)).'%; width: '.($el->SIZE_M_W * (100.0 / 2)).'%; left: '.($el->POS_M_X * (100.0 / 2)).'%; top: '.($el->POS_M_Y * (100.0 / $mod_height_mobile)).'%; z-index: '.($i+1).'; }' . "\n";
		}
		// output the final CSS code
		return $output_desktop . '@media (max-width: '.$this->config['tablet_width'].'px) { ' . "\n" . '.gkGridGK5 .gkImgTablet { display: block; } .gkGridGK5 .gkImgDesktop, .gkGridGK5 .gkImgMobile { display: none; } ' . "\n" . $output_tablet . '} ' . "\n" . '@media (max-width: '.$this->config['mobile_width'].'px) { ' . "\n" . '.gkGridGK5 .gkImgMobile { display: block; } .gkGridGK5 .gkImgDesktop, .gkGridGK5 .gkImgTablet { display: none; } ' . "\n"  . $output_mobile . '} ';
	}
	// function to generate blank transparent PNG images
	public function generateBlankImage($width, $height){ 
		$image = imagecreatetruecolor($width, $height);
		imagesavealpha($image, true);
		$transparent = imagecolorallocatealpha($image, 0, 0, 0, 127);
		imagefill($image, 0, 0, $transparent);
		// cache the output
		ob_start();
		imagepng($image);
		$img =  ob_get_contents();
		ob_end_clean();
		// return the string
		return base64_encode($img);
	}
}

// EOF