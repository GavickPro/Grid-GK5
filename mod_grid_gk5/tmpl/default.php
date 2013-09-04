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

<?php if(count($this->tabs["title"]) > 0) : ?>
<div id="<?php echo $this->config['module_id'];?>" class="gkTabsGK5" data-config="<?php echo $config_data; ?>" data-swipe="<?php echo $this->config['mobile_swipe'];?>">
	<div class="gkTabsWrap <?php echo ($this->config['tabs_position'] == 'left' || $this->config['tabs_position'] == 'right') ? 'horizontal' : 'vertical'; ?>">
	    <?php if($this->config['tabs_position'] == 'top' || $this->config['tabs_position'] == 'left') : ?>
	    <ol class="gkTabsNav">
	    	<?php for($i = 0; $i < count($this->tabs["title"]); $i++) : ?>
	    	<?php $active_class = ($this->active_tab == $i + 1) ? ' active' : ''; ?>
	    	<li<?php if($this->tabs["id"][$i] != '') echo ' id="'.($this->tabs['id'][$i]).'"'; ?> class="gkTabs-<?php echo ($i+1) . $active_class; ?>" data-animation="<?php echo $this->tabs['animation'][$i]!= '' ? $this->tabs['animation'][$i] : 'default'; ?>">
	    		<?php if($this->config['tabs_spans'] == '1'): ?><span><?php endif; ?>
	    			<?php echo $this->tabs["title"][$i]; ?>
	    		<?php if($this->config['tabs_spans'] == '1'): ?></span><?php endif; ?>
	    	</li>
	    	<?php endfor; ?>
	    </ol>
	    <?php endif; ?>
	                
		<div class="gkTabsContainer">
	    	<?php $this->moduleRender(); ?>
	    </div>
		
		<?php if($this->config['tabs_position'] == 'bottom' || $this->config['tabs_position'] == 'right') : ?>
		<ol class="gkTabsNav">
			<?php for($i = 0; $i < count($this->tabs["title"]); $i++) : ?>
			<?php $active_class = ($this->active_tab == $i + 1) ? ' active' : ''; ?>
			<li<?php if($this->tabs["id"][$i] != '') echo ' id="'.($this->tabs['id'][$i]).'"'; ?> class="gkTabs-<?php echo ($i+1) . $active_class; ?>" data-animation="<?php echo $this->tabs['animation'][$i]!= '' ? $this->tabs['animation'][$i] : 'default'; ?>">
				<?php if($this->config['tabs_spans'] == '1'): ?><span><?php endif; ?>
					<?php echo $this->tabs["title"][$i]; ?>
				<?php if($this->config['tabs_spans'] == '1'): ?></span><?php endif; ?>
			</li>
			<?php endfor; ?>
		</ol>
		<?php endif; ?>
	</div>
		
	<?php if(
		$this->config['buttons'] == 1 && 
		(
			$this->config['tabs_position'] == 'top' || 
			$this->config['tabs_position'] == 'bottom' ||
			$this->config['tabs_position'] == 'disabled'
		)
	) : ?>
	<div class="gkTabsButtonNext">next</div>
	<div class="gkTabsButtonPrev">prev</div>
	<?php endif; ?>
</div>
<?php else : ?>
	<?php echo JText::_('MOD_TABS_GK5_NO_TABS_TO_SHOW'); ?>
<?php endif; ?>