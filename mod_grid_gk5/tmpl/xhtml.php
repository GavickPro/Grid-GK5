<?php

/**
* Tabs GK5 - content (X)HTML template
* @package Joomla!
* @Copyright (C) 2009-2012 Gavick.com
* @ All rights reserved
* @ Joomla! is Free Software
* @ Released under GNU/GPL License : http://www.gnu.org/copyleft/gpl.html
* @version $Revision: GK5 1.0 $
**/

// access restriction
defined('_JEXEC') or die('Restricted access');

?>

<div class="gkTabsItem<?php echo $active_class; ?>">
	<?php echo str_replace('[ampersand]', '&', str_replace('[leftbracket]', '<', str_replace('[rightbracket]', '>', $content))); ?>
</div>