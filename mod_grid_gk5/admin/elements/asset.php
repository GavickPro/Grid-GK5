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

class JFormFieldAsset extends JFormField {
	protected $type = 'Asset';

    protected function getInput() {
    	// get the handler for the back-end document
		$doc = JFactory::getDocument();
		// include the prefixfree for less work with CSS code
		$doc->addScript(JURI::root().$this->element['path'].'prefixfree.js');
		// include the back-end scripts
		
		// output the translation phrases
		$script_lang = 'GKGridManagerLang = [];'
		. 'GKGridManagerLang["GRID_NO_BLOCKS"] = "'. JText::_('MOD_GRID_NO_BLOCKS') . '";' . "\n"
		. 'GKGridManagerLang["LIST_SIZE"] = "'. JText::_('MOD_GRID_LIST_SIZE') . '";' . "\n"
		. 'GKGridManagerLang["LIST_POSITION"] = "'. JText::_('MOD_GRID_LIST_POSITION') . '";' . "\n"
		.'GKGridManagerLang["LIST_DESKTOP_SIZE"] = "'. JText::_('MOD_GRID_LIST_DESKTOP_SIZE') . '";' . "\n"
		. 'GKGridManagerLang["LIST_TABLET_SIZE"] = "'. JText::_('MOD_GRID_LIST_TABLET_SIZE') . '";' . "\n"
		. 'GKGridManagerLang["LIST_MOBILE_SIZE"] = "'. JText::_('MOD_GRID_LIST_MOBILE_SIZE') . '";' . "\n"
		. 'GKGridManagerLang["LIST_CANCEL"] = "'. JText::_('MOD_GRID_LIST_CANCEL') . '";' . "\n"
		. 'GKGridManagerLang["LIST_ADD_BLOCK"] = "'. JText::_('MOD_GRID_LIST_ADD_BLOCK') . '";' . "\n"
		. 'GKGridManagerLang["LIST_SAVE_BLOCK"] = "'. JText::_('MOD_GRID_LIST_SAVE_BLOCK') . '";' . "\n"
		. 'GKGridManagerLang["LIST_ERROR_DESKTOP"] = "'. JText::_('MOD_GRID_LIST_ERROR_DESKTOP') . '";' . "\n"
		. 'GKGridManagerLang["LIST_ERROR_TABLET"] = "'. JText::_('MOD_GRID_LIST_ERROR_TABLET') . '";' . "\n"
		. 'GKGridManagerLang["LIST_ERROR_MOBILE"] = "'. JText::_('MOD_GRID_LIST_ERROR_MOBILE') . '";' . "\n"; 
		$doc->addScriptDeclaration($script_lang);
		//$doc->addScript(JURI::root().$this->element['path'].'jquery.js');
		$doc->addScript(JURI::root().$this->element['path'].'jquery.spinner.js');
		$doc->addScript(JURI::root().$this->element['path'].'jquery.sortable.js');
		$doc->addScript(JURI::root().$this->element['path'].'script.js');
		// include the back-end styles
		//$doc->addStyleSheet(JURI::root().$this->element['path'].'font-awesome.css');
		$doc->addStyleSheet(JURI::root().$this->element['path'].'style.css');
		// output the social media inputs
		echo '<div id="gk-social"><span>Follow us on the social media: </span> <iframe src="//www.facebook.com/plugins/like.php?href=http%3A%2F%2Ffacebook.com%2Fgavickpro&amp;send=false&amp;layout=button_count&amp;width=150&amp;show_faces=false&amp;font=arial&amp;colorscheme=light&amp;action=like&amp;height=21" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:150px; height:21px;" allowTransparency="true"></iframe> <a href="https://twitter.com/gavickpro" class="twitter-follow-button" data-show-count="false">Follow @gavickpro</a><script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?\'http\':\'https\';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+\'://platform.twitter.com/widgets.js\';fjs.parentNode.insertBefore(js,fjs);}}(document, \'script\', \'twitter-wjs\');</script></div>';  
		// return null, because there is no HTML output
		return null;
	}
}

// EOF