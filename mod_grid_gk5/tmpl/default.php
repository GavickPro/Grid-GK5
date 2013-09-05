<?php

/**
* Tabs GK5 - content template
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

<div 
	id="<?php echo $this->config['module_id'];?>" 
	class="gkGridGK5" 
	data-animation="<?php echo $this->config['animation']; ?>"
	data-random="<?php echo $this->config['animation_random']; ?>"
	data-speed="<?php echo $this->config['animation_speed']; ?>"
	data-type="<?php echo $this->config['animation_type']; ?>"
>    
	<div class="gkGridGK5Wrap" style="margin: <?php echo $this->config['grid_margin']; ?>">            
		<?php $this->moduleRender(); ?>
		 
		<img class="gkImgDesktop" src="data:image/png;base64,<?php echo $this->generateBlankImage(60, 10 * $this->config['grid_data']->heights->desktop); ?>" alt="" />
		<img class="gkImgTablet" src="data:image/png;base64,<?php echo $this->generateBlankImage(40, 10 * $this->config['grid_data']->heights->tablet); ?>" alt="" />
		<img class="gkImgMobile" src="data:image/png;base64,<?php echo $this->generateBlankImage(20, 10 * $this->config['grid_data']->heights->mobile); ?>" alt="" />
	</div>
</div>