<?php

/**
* Tabs GK5 - main PHP file
* @package Joomla!
* @Copyright (C) 2009-2012 Gavick.com
* @ All rights reserved
* @ Joomla! is Free Software
* @ Released under GNU/GPL License : http://www.gnu.org/copyleft/gpl.html
* @ version $Revision: GK5 1.0 $
**/

defined('JPATH_BASE') or die;

jimport('joomla.form.formfield');
jimport('joomla.version');

class JFormFieldAbout extends JFormField {
	protected $type = 'About';

	protected function getInput() {
		$version = new JVersion;
		$ver = $version->getShortVersion();
		
		return '<div id="gk_about_us" data-jversion="'.$ver.'">' . JText::_('MOD_GRID_ABOUT_US_CONTENT') . '</div></div>';
	}
}

// EOF