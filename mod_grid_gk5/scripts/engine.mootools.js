window.addEvent('load', function(){
	setTimeout(function() {
		document.getElements('.gkGridGK5').each(function(el,i) {
			var animation = el.getProperty('data-animation');
			var animation_random = el.getProperty('data-random');
			var animation_speed = el.getProperty('data-speed') == 'normal' ? 500 : (el.getProperty('data-speed') == 'fast') ? 250 : 750;
			var animation_divider = el.getProperty('data-speed') == 'normal' ? 4 : (el.getProperty('data-speed') == 'fast') ? 2 : 6;
			var animation_type = el.getProperty('data-type');
			
			if(animation === '1') {
				var blocks = el.getElements('.gkGridElement');
				
				if(animation_random === '0') {
					// linear
					for(var i = 0, len = blocks.length; i < len; i++) {
						gkGridGK5AddClass(blocks[i], 'active', i * (animation_speed / animation_divider));
					}
				} else { // or random animation
					var randomVector = [];
					for(var i = 0, len = blocks.length; i < len; i++) {
						randomVector[i] = i;
					}
					randomVector = gkGridGK5Shuffle(randomVector);
					//
					for(var j = 0, len = blocks.length; j < len; j++) {
						gkGridGK5AddClass(blocks[randomVector[j]], 'active', j * (animation_speed / animation_divider));
					}		
				}
				
				setTimeout(function() {
					el.getElement('.gkGridGK5Wrap').addClass('active');
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