jQuery(window).load(function(){
	setTimeout(function() {
		jQuery('.gkGridGK5').each(function(i,el) {
			el = jQuery(el);
			var animation = el.attr('data-animation');
			var animation_random = el.attr('data-random');
			var animation_speed = el.attr('data-speed') == 'normal' ? 500 : (el.attr('data-speed') == 'fast') ? 250 : 750;
			var animation_divider = el.attr('data-speed') == 'normal' ? 4 : (el.attr('data-speed') == 'fast') ? 2 : 6;
			var animation_type = el.attr('data-type');
			
			if(animation === '1') {
				var blocks = el.find('.gkGridElement');
				
				if(animation_random === '0') {
					// linear
					for(var i = 0, len = blocks.length; i < len; i++) {
						gkGridGK5AddClass(jQuery(blocks[i]), 'active', i * (animation_speed / animation_divider));
					}
				} else { // or random animation
					var randomVector = [];
					for(var i = 0, len = blocks.length; i < len; i++) {
						randomVector[i] = i;
					}
					randomVector = gkGridGK5Shuffle(randomVector);
					//
					for(var j = 0, len = blocks.length; j < len; j++) {
						gkGridGK5AddClass(jQuery(blocks[randomVector[j]]), 'active', j * (animation_speed / animation_divider));
					}		
				}
				
				setTimeout(function() {
					jQuery(el.find('.gkGridGK5Wrap')).addClass('active');
				}, blocks.length * (animation_speed / animation_divider));
			}
		});
	}, 500);
});

function gkGridGK5AddClass(elm, className, delay) {
	setTimeout(function() {
		elm.addClass(className)
	}, delay);
}

function gkGridGK5Shuffle(arr){
    for(var j, x, i = arr.length; i; j = Math.floor(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
    return arr;
};