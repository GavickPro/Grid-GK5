<?php

/**
* Grid GK5 - main PHP file
* @package Joomla!
* @Copyright (C) 2009-2012 Gavick.com
* @ All rights reserved
* @ Joomla! is Free Software
* @ Released under GNU/GPL License : http://www.gnu.org/copyleft/gpl.html
* @ version $Revision: GK5 1.0 $
**/

defined('JPATH_BASE') or die;

jimport('joomla.form.formfield');

class JFormFieldGridmanager extends JFormField {
	protected $type = 'Gridmanager';

	protected function getInput() {
		$grid_form = '
		<div id="gk_grid_manager_state_info">'.JText::_('MOD_GRID_CHANGED').'</div>
		<div id="gk_grid_manager">
			<div class="gk_grid_blocks">
				<div class="gk_grid_header">
					<h3>'.JText::_('MOD_GRID_GRID_BLOCKS').'</h3>
					<button id="gk_grid_add" class="gk_grid_btn"><i class="icon-plus"></i></button>
					<div id="gk_grid_form_add">
						<div>
							<p><label>'.JText::_('MOD_GRID_LIST_POSITION').'</label> <span><input type="text" size="14" id="gk_grid_form_add_position" /></span></p>
							<p><label>'.JText::_('MOD_GRID_LIST_DESKTOP_SIZE').'</label> <span><input type="number" size="1" min="1" max="6" value="1" id="gk_grid_form_add_desktop_w" /> &times; <input type="number" size="1" min="1" max="9" value="1" id="gk_grid_form_add_desktop_h" /></span></p>
							<p><label>'.JText::_('MOD_GRID_LIST_TABLET_SIZE').'</label> <span><input type="number" size="1" min="1" max="4" value="1" id="gk_grid_form_add_tablet_w" /> &times; <input type="number" size="1" min="1" max="9" value="1" id="gk_grid_form_add_tablet_h" /></span></p>
							<p><label>'.JText::_('MOD_GRID_LIST_MOBILE_SIZE').'</label> <span><input type="number" size="1" min="1" max="2" value="1" id="gk_grid_form_add_mobile_w" /> &times; <input type="number" size="1" min="1" max="9" value="1" id="gk_grid_form_add_mobile_h" /></span></p>
							
							<p><button id="gk_grid_form_add_cancel" class="gk_grid_btn">'.JText::_('MOD_GRID_LIST_CANCEL').'</button><button id="gk_grid_form_add_save" class="gk_grid_btn">'.JText::_('MOD_GRID_LIST_ADD_BLOCK').'</button></p>
						</div>
					</div>
				</div>
				
				<div class="gk_grid_content">
					<ul id="gk_grid_blocks_list"></ul>
				</div>
			</div>
			<div class="gk_grid_preview">
				<div class="gk_grid_header">
					<h3>'.JText::_('MOD_GRID_PREVIEW').'</h3>
				</div>
				
				<div class="gk_grid_content">					
					<div id="gk_grid_desktop_preview">
						<span>'.JText::_('MOD_GRID_NO_BLOCKS').'</span>
					</div>
					
					<h4><i class="icon-screen"></i></h4>
					
					<div class="gk_grid_mobile_preview">
						<div>
							<div id="gk_grid_tablet_preview">
								<span>'.JText::_('MOD_GRID_NO_BLOCKS').'</span>
							</div>
							
							<h4><i class="icon-tablet"></i></h4>
						</div>
						
						<div>
							<div id="gk_grid_mobile_preview">
								<span>'.JText::_('MOD_GRID_NO_BLOCKS').'</span>
							</div>
							
							<h4><i class="icon-mobile"></i></h4>
						</div>
					</div>
				</div>
			</div>
		</div>';
		$textarea = '<textarea name="'.$this->name.'" id="'.$this->id.'" rows="20" cols="50">'.$this->value.'</textarea>';
		// output all elements
		return $grid_form . $textarea;
	}	
}

// EOF