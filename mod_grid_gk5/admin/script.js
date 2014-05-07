jQuery.noConflict();

jQuery(document).ready(function() {
	// GKGridManager module
	// remove unnecessary labels 
	// check Joomla! version and add suffix
	if(parseFloat((jQuery('#gk_about_us').data('jversion')).substr(0,3)) >= '3.2') {
  		jQuery('#module-form').addClass('j32');
 	}
	
	jQuery('#jform_params_about_us-lbl').parent().css('display', 'none');
	jQuery('#jform_params_about_us-lbl').parents().eq(2).find('.controls').css('margin-left', '15px');
	jQuery('#jform_params___field1-lbl').parent().css('display', 'none');
	jQuery('#jform_params___field1-lbl').parents().eq(1).find('.controls').css('margin-left', '0px');
	jQuery('#gk_grid_manager').parents().eq(1).find('.controls').css('margin-left', '0px');
	
	
	// input-append
	jQuery('.input-px').each(function(i, el){jQuery(el).parent().html("<div class=\"input-prepend\">" + jQuery(el).parent().html() + "<span class=\"add-on\">px</span></div>")});
	
	var GKGridManager = (function () {
		//
		// private fields
		//
		
		// handlers
		var addForm = jQuery('#gk_grid_form_add');
		var blockListUL = jQuery('#gk_grid_blocks_list');
		var dataJSON = jQuery('#jform_params_grid_data');
		var changeState = false;
		// templates
		var listItem = '<li data-id="{{ID}}"><div class="gk_handler"><i class="icon-sign-blank gkColor{{COLOR_ID}}" data-colorid="{{COLOR_ID}}"></i><strong>{{POSITION}}</strong> <span data-size="{{SIZE_DATA}}" class="data-size-info">'+GKGridManagerLang["LIST_SIZE"]+' {{SIZE_D_W}} &times; {{SIZE_D_H}}</span> <i class="icon-remove" data-id="{{ID}}"></i> <i class="icon-pencil-2" data-id="{{ID}}"></i></div><div class="gk_grid_form_edit"><div><p><label>'+GKGridManagerLang["LIST_POSITION"]+'</label> <span><input type="text" size="15" class="gk_grid_form_add_position" value="{{POSITION}}" /></span></p><p><label>'+GKGridManagerLang["LIST_DESKTOP_SIZE"]+'</label> <span><input type="number" size="1" min="1" max="6" value="{{SIZE_D_W}}" class="gk_grid_form_add_desktop_w" /> &times; <input type="number" size="1" min="1" max="9" value="{{SIZE_D_H}}" class="gk_grid_form_add_desktop_h" /></span></p><p><label>'+GKGridManagerLang["LIST_TABLET_SIZE"]+'</label> <span><input type="number" size="1" min="1" max="4" value="{{SIZE_T_W}}" class="gk_grid_form_add_tablet_w" /> &times; <input type="number" size="1" min="1" max="9" value="{{SIZE_T_H}}" class="gk_grid_form_add_tablet_h" /></span></p><p><label>'+GKGridManagerLang["LIST_MOBILE_SIZE"]+'</label> <span><input type="number" size="1" min="1" max="2" value="{{SIZE_M_W}}" class="gk_grid_form_add_mobile_w" /> &times; <input type="number" size="1" min="1" max="9" value="{{SIZE_M_H}}" class="gk_grid_form_add_mobile_h" /></span></p><p><button class="gk_grid_form_edit_cancel gk_grid_btn" data-id="{{ID}}">'+GKGridManagerLang["LIST_CANCEL"]+'</button><button class="gk_grid_form_edit_save gk_grid_btn" data-id="{{ID}}">'+GKGridManagerLang["LIST_SAVE_BLOCK"]+'</button></p></div></div></li>';
		// data storage
		var blockList = [];
		//
		// private methods
		//
		var updateJSON = function() {
			calculatePreview('desktop');
			calculatePreview('tablet');
			calculatePreview('mobile');
			dataJSON.text(
				JSON.stringify(
					{
						"blocks": blockList, 
						"heights": {
							"desktop": jQuery('#gk_grid_desktop_preview').attr('data-height'),
							"tablet": jQuery('#gk_grid_tablet_preview').attr('data-height'),
							"mobile": jQuery('#gk_grid_mobile_preview').attr('data-height')
						}
					}
				)
			);
		};
		
		var readJSON = function() {
			if(dataJSON.text() !== '') {
				blockList = JSON.parse(dataJSON.text());
				blockList = blockList.blocks;
			}
		};
		
		var renderItems = function() {
			for(var i = 0, len = blockList.length; i < len; i++) {
				var tpl = listItem;
				for(var field in blockList[i]) {
					var re = new RegExp('{{'+field+'}}', 'g');
					tpl = tpl.replace(re, blockList[i][field]);
				}
				
				blockListUL.append(jQuery(tpl));
			}
		};
		
		var showStateInfo = function() {
			if(!changeState) {
				changeState = true;
				jQuery('#gk_grid_manager_state_info').addClass('active');
			}
		}
		
		var calculatePreview = function(type, initial) {
			if(blockList.length > 0) {
				// specify the size of render area
				var size = type == 'desktop' ? 6 : type == 'tablet' ? 4 : 2;
				var sizeName = type == 'desktop' ? 'D' : type == 'tablet' ? 'T' : 'M';
				// copy the block list to put additional values like position
				var copy = blockList.slice(0);
				var results = [];
				var freeX = 0;
				var freeY = 0;
				var freeSize = 0;
				// create the results array 
				var preview = [];
				// creating the necessary items in the results array
				for(var i = 0; i < size; i++) {
					preview[i] = 0;
				}
				// put the first item to the results array - it will always works
				for(var i = 0; i < copy[0]['SIZE_' + sizeName + '_W']; i++) {
					preview[i] += 1 * copy[0]['SIZE_' + sizeName + '_H'];
				}
				
				copy[0]['POS_'+sizeName+'_X'] = 0;
				copy[0]['POS_'+sizeName+'_Y'] = 0;
				
				freeX += 1 * copy[0]['SIZE_' + sizeName + '_W']; 
				freeSize = size - freeX;
				
				if(freeX >= size) {
					freeY = 1 * copy[0]['SIZE_' + sizeName + '_H'];
					freeX = 0;
					freeSize = size;
				}
				
				results.push(copy[0]);
				copy.splice(0, 1);
				
				// put the next elements
				var $iterationCount = 0; // security reasons ;)
	
				while(copy.length > 0 && $iterationCount < 999) {
					$iterationCount++;
					var itemAdded = false;
					// search the next element
					for(var x = 0; x < copy.length; x++) {
						// if element has proper size for the allowed free space
						if(copy[x]['SIZE_' + sizeName + '_W'] <= freeSize) {
							// put the element to an array
							for(var y = 0; y < copy[x]['SIZE_' + sizeName + '_W']; y++) {
								preview[freeX + y] += 1 * copy[x]['SIZE_' + sizeName + '_H'];
							}
							// get the position of the block
							copy[x]['POS_'+sizeName+'_X'] = freeX;
							copy[x]['POS_'+sizeName+'_Y'] = freeY;
							// find the starting point - minimum value in the preview array
							min = preview[0];
							freeX = 0;
							
							for(var z = 1; z < size; z++) {
								if(preview[z] < min) {
									freeX = z;
									min = preview[z];
								}
							} 
							// get the Y value based on the X
							freeY = preview[freeX];
							/// set the minimum size for free space pointer
							freeSize = 1;
							// find more free space (if exists)
							for(var o = freeX+1; o < size; o++) {
								if(preview[o] === freeY) {
									freeSize++;
								} else {
									break;
								}
							}
							// push the results and clear copy
							results.push(copy[x]);
							copy.splice(x, 1);
							// set the flag to avoid searching proper free space
							itemAdded = true;
							break;
						}
					}
					// if item wasn't added - work to fill the empty fields and start again
					if(!itemAdded) {					
						//[DEV]console.log('START', preview, freeX, freeY, freeSize);
						
						// Increase the empty spaces values in the preview array - we have to skip it
						for(var a = freeX; (a < freeX + (freeSize === 0 ? 1 : freeSize)) && (a < size); a++) {
							if(preview[a] <= freeY) {
								preview[a] += 1.0;
							}
						}
						
						//[DEV]console.log(preview);
						
						// if there is some space to check
						if(freeSize > 0) {
							// increase the X
							freeX = freeX + freeSize;
							// check if the next free space exist 
							if(preview[freeX] > freeY) {
								var founded = false;
								// set the Y
								for(var b = freeX; b < size; b++) {
									if(preview[b] <= freeY) {
										freeX = b;
										founded = true;
										break;
									}
								}
								
								if(!founded) {
									freeX = size;
								}
							}
						} else {
							// skip if there is no space in this row
							freeX++;
						}
						// if X is too big				
						if(freeX >= size) {
							// skip to the next row
							freeY++;
							// find the minimum value of Y for X
							min = preview[0];
							freeX = 0;
							
							for(var z = 1; z < size; z++) {
								if(preview[z] < min) {
									freeX = z;
									min = preview[z];
								}
							}
						}
						// if there is more space to check
						if(freeX+1 < size) {
							// It is magic - I don't know why but it works perfectly in very strange cases
							var addon = ((freeSize === 0) ? 0 : ((freeX == 0) ? 0: 1));
							freeSize = 0;
							// find the free area
							for(var o = freeX + addon; o < size; o++) {
								if(preview[o] <= freeY) {
									freeSize++;
								} else {
									break;
								}
							}
						} else {
							// if there is no more space - set size to 0
							freeSize = 0;
						}
						
						//[DEV]console.log('END', freeX, freeY, freeSize);
					}
				}
				// render the visual preview
				renderPreview(size, sizeName, results, preview, type);
			} else {
				// set height auto when there is no blocks defined
				jQuery('#gk_grid_desktop_preview').html('<p>' + GKGridManagerLang["GRID_NO_BLOCKS"] + '</p>').css('height', 'auto');	
				jQuery('#gk_grid_tablet_preview').html('<p>' + GKGridManagerLang["GRID_NO_BLOCKS"] + '</p>').css('height', 'auto');	
				jQuery('#gk_grid_mobile_preview').html('<p>' + GKGridManagerLang["GRID_NO_BLOCKS"] + '</p>').css('height', 'auto');	
			}
			
			if(!initial) {
				showStateInfo();
			}
		}
		
		var renderPreview = function(size, sizeName, results, preview, type) {
			var heightProportionsSize = sizeName == 'D' ? 'desktop' : sizeName == 'T' ? 'tablet' : 'mobile';
			var heightProportions = Math.round((jQuery('#jform_params_grid_proportions_' + heightProportionsSize).val() * 100)) / 100;

			if(
				parseFloat(heightProportions) === NaN ||
				parseFloat(heightProportions) === 0
			) {
				heightProportions = 1;
			} else {
				heightProportions = parseFloat(heightProportions);
			}
			
			var area = jQuery('#gk_grid_'+type+'_preview');
			// find the max value in preview
			var max = preview[0];
			for(var m = 1; m < size; m++) {
				if(preview[m] > max) {
					max = preview[m];
				}
			}
			// set a new height;
			area.css('height', max * heightProportions * (sizeName !== 'D' ? 25 : 30) + "px");
			area.attr('data-height', max);
			// generate the output
			var htmlOutput = '';
			
			for(var i = 0, len = results.length; i < len; i++) {
				var elementSize = (sizeName !== 'D' ? 25 : 30);
				htmlOutput += '<div class="gkGridElm gkColor'+results[i]['COLOR_ID']+'" data-id="'+results[i]['ID']+'" style="width: '+(results[i]['SIZE_'+sizeName+'_W'] * elementSize)+'px; height: '+(results[i]['SIZE_'+sizeName+'_H'] * elementSize * heightProportions)+'px; top: '+(((results[i]['POS_'+sizeName+'_Y'] * elementSize * heightProportions)+4))+'px; left: '+((results[i]['POS_'+sizeName+'_X'] * elementSize)+4)+'px;"></div>';
			}
			
			area.html(htmlOutput);
		}
		
		var initBasicEvents = function() {
			// initialize the toggler of the add block form
			jQuery('#gk_grid_add').click(function(e) {
				e.preventDefault();
				addForm.toggleClass('active');	
			});
			// initialize the togglers for the list of blocks
			blockListUL.click(function(e) {
				var li = false;
				// check if user clicked the LI element
				if(jQuery(e.target).prop('tagName') == 'LI') {
					li = jQuery(e.target);
				} else if(
					(jQuery(e.target).prop('tagName') == 'I' && jQuery(e.target).hasClass('icon-pencil-2')) ||
					(jQuery(e.target).prop('tagName') == 'SPAN' && jQuery(e.target).hasClass('data-size-info'))
				) {
					li = jQuery(e.target).parent().parent();
				} else if(jQuery(e.target).hasClass('gk_grid_form_edit_cancel')) {
					e.preventDefault();
					// get the ID
					var ID = jQuery(e.target).attr('data-id');
					// remove the active class from form
					jQuery('#gk_grid_blocks_list li[data-id="'+ID+'"] .gk_grid_form_edit').removeClass('active');
					// preview - disable
					jQuery('.gk_grid_preview .previewed').removeClass('previewed');	
				} else if(jQuery(e.target).hasClass('gk_grid_form_edit_save')) {
					e.preventDefault();
					// get the ID
					var ID = jQuery(e.target).attr('data-id');
					
					var validation = true;
					var errorInfo = '';
					
					if(blockListUL.find('li[data-id="'+ID+'"] .gk_grid_form_add_desktop_w').val() > 6) {
						validation = false;
						errorInfo += GKGridManagerLang["LIST_ERROR_DESKTOP"] + "\n";
					}
					
					if(blockListUL.find('li[data-id="'+ID+'"] .gk_grid_form_add_tablet_w').val() > 4) {
						validation = false;
						errorInfo += GKGridManagerLang["LIST_ERROR_TABLET"] + "\n";
					}
					
					if(blockListUL.find('li[data-id="'+ID+'"] .gk_grid_form_add_mobile_w').val() > 2) {
						validation = false;
						errorInfo += GKGridManagerLang["LIST_ERROR_MOBILE"] + "\n";
					}
					
					if(!validation) {
						alert(errorInfo);
						return;
					}
					
					var num = false;
					// find the object
					for(var i = 0, len = blockList.length; i < len; i++) {
						if(blockList[i].ID === ID) {
							num = i;
							break;
						}
					}
					// get the new values
					blockList[num]["POSITION"] = blockListUL.find('li[data-id="'+ID+'"] .gk_grid_form_add_position').val();
					blockList[num]["SIZE_D_W"] = blockListUL.find('li[data-id="'+ID+'"] .gk_grid_form_add_desktop_w').val();
					blockList[num]["SIZE_D_H"] = blockListUL.find('li[data-id="'+ID+'"] .gk_grid_form_add_desktop_h').val();
					blockList[num]["SIZE_T_W"] = blockListUL.find('li[data-id="'+ID+'"] .gk_grid_form_add_tablet_w').val();
					blockList[num]["SIZE_T_H"] = blockListUL.find('li[data-id="'+ID+'"] .gk_grid_form_add_tablet_h').val();
					blockList[num]["SIZE_M_W"] = blockListUL.find('li[data-id="'+ID+'"] .gk_grid_form_add_mobile_w').val();
					blockList[num]["SIZE_M_H"] = blockListUL.find('li[data-id="'+ID+'"] .gk_grid_form_add_mobile_h').val();
					blockList[num]['SIZE_DATA'] = 	blockList[num]['SIZE_D_W'] + ',' + 
													blockList[num]['SIZE_D_H'] + ',' + 
													blockList[num]['SIZE_T_W'] + ',' + 
													blockList[num]['SIZE_T_H'] + ',' + 
													blockList[num]['SIZE_M_W'] + ',' + 
													blockList[num]['SIZE_M_H'];
					// update the list block element
					var previousPositionName = blockListUL.find('li[data-id="'+ID+'"] > div > strong').text();
					blockListUL.find('li[data-id="'+ID+'"] > div > strong').text(blockList[num]["POSITION"]);
					blockListUL.find('li[data-id="'+ID+'"] > div > span').html('Size: ' + blockList[num]["SIZE_D_W"] + ' &times; ' + blockList[num]["SIZE_D_H"]);
					
					// generate a new ID - if necessary
					if(blockList[num]["POSITION"] !== previousPositionName) {
						var iteratorID = 1;
						while(jQuery('#gk_grid_blocks_list li[data-id="'+blockList[num]["POSITION"]+'-'+iteratorID+'"]').length > 0) {
							iteratorID++;
						}
						// store new ID
						blockList[num]["ID"] = blockList[num]["POSITION"] + '-' + iteratorID;
						// .. and change the data-id attribute
						jQuery('#gk_grid_blocks_list li[data-id="'+ID+'"]').attr('data-id', blockList[num]["ID"]);
						jQuery('#gk_grid_blocks_list .gk_grid_form_edit_cancel[data-id="'+ID+'"]').attr('data-id', blockList[num]["ID"]);
						jQuery('#gk_grid_blocks_list .gk_grid_form_edit_save[data-id="'+ID+'"]').attr('data-id', blockList[num]["ID"]);
					}
					// close the form - remove the active class from form
					jQuery('#gk_grid_blocks_list li[data-id="'+blockList[num]["ID"]+'"] .gk_grid_form_edit').removeClass('active');
					// preview - disable
					jQuery('.gk_grid_preview .previewed').removeClass('previewed');
					// update data in the storage
					updateJSON();
				} else if(
					jQuery(e.target).prop('tagName') == 'I' && 
					jQuery(e.target).hasClass('icon-remove')
				) {
					var ID = jQuery(e.target).attr('data-id');
					var amount = blockList.length;
					var index = 0;
					
					while(blockList[index].ID !== ID && index < amount) {
						index++;
					}

					if(blockList[index].ID === ID) {
						blockList.splice(index,1);
						updateJSON();
						blockListUL.find('li[data-id="'+ID+'"]').remove();
					}
				} else if(jQuery(e.target).parent().prop('tagName') == 'LI') {
					li = jQuery(e.target).parent();
				}
				// if the LI element was clicked
				if(li) {
					// get the ID of the clciked element
					var activeID = li.attr('data-id');
					// remove or add the active class
					if(jQuery('#gk_grid_blocks_list li[data-id="'+activeID+'"] .gk_grid_form_edit').hasClass('active')) {
						jQuery('#gk_grid_blocks_list li[data-id="'+activeID+'"] .gk_grid_form_edit').removeClass('active');
						// preview - disable
						jQuery('.gk_grid_preview .previewed').removeClass('previewed');
					} else {
						jQuery('#gk_grid_blocks_list li .gk_grid_form_edit').removeClass('active');
						jQuery('#gk_grid_blocks_list li[data-id="'+activeID+'"] .gk_grid_form_edit').addClass('active');
						// preview - enable
						jQuery('.gk_grid_preview .previewed').removeClass('previewed');
						jQuery('.gkGridElm[data-id="'+activeID+'"]').addClass('previewed');
					}
				}
			});
			// initialize the sortable list
			blockListUL.sortable({
				handle: 'li .gk_handler',
				onDrop: function ($item, container, _super) {
					// call the parent method
					_super($item);
					// refresh the list of items
				 	var tempNewList = [];
				 	for(var i = 0, len = blockListUL.find('li').length; i < len; i++) {
				 		for(var j = 0, len2 = blockList.length; j < len2; j++) {
				 			if(blockList[j].ID === jQuery(blockListUL.find('li')[i]).attr('data-id')) {
				 				tempNewList.push(blockList[j]);
				 				blockList.splice(j, 1)
				 				break;
				 			}
				 		}	
				 	}
				 	blockList = tempNewList;
				 	updateJSON();
				}
			});
			// initialize the clickable preview
			jQuery('#gk_grid_desktop_preview').click(function(e) {
				activatePreview(e);
			});
			jQuery('#gk_grid_tablet_preview').click(function(e) {
				activatePreview(e);
			});
			jQuery('#gk_grid_mobile_preview').click(function(e) {
				activatePreview(e);
			});
		};
		// 
		var activatePreview = function(e, type) {
			if(jQuery(e.target).attr('data-id')) {
				var ID = jQuery(e.target).attr('data-id');
				// add new previewed class
				jQuery('#gk_grid_desktop_preview div').removeClass('previewed');
				jQuery('#gk_grid_desktop_preview div[data-id="'+ID+'"]').addClass('previewed'); 
				jQuery('#gk_grid_tablet_preview div').removeClass('previewed');
				jQuery('#gk_grid_tablet_preview div[data-id="'+ID+'"]').addClass('previewed'); 
				jQuery('#gk_grid_mobile_preview div').removeClass('previewed');
				jQuery('#gk_grid_mobile_preview div[data-id="'+ID+'"]').addClass('previewed'); 
				// open the proper editor
				blockListUL.find('li .gk_grid_form_edit').removeClass('active');
				blockListUL.find('li[data-id="'+ID+'"] .gk_grid_form_edit').addClass('active');
			}
		};
		//
		var initAddForm = function() {
			jQuery('#gk_grid_form_add_cancel').click(function(e) {
				e.preventDefault();
				addForm.removeClass('active');
				jQuery('#gk_grid_form_add_position').val('');
				addForm.find('input[type="number"]').val('1');
			});
			
			jQuery('#gk_grid_form_add_save').click(function(e) {
				e.preventDefault();
				var results = {
					"ID": '',
					"COLOR_ID": '',
					"POSITION": jQuery('#gk_grid_form_add_position').val(),
					"SIZE_D_W": jQuery('#gk_grid_form_add_desktop_w').val(),
					"SIZE_D_H": jQuery('#gk_grid_form_add_desktop_h').val(),
					"SIZE_T_W": jQuery('#gk_grid_form_add_tablet_w').val(),
					"SIZE_T_H": jQuery('#gk_grid_form_add_tablet_h').val(),
					"SIZE_M_W": jQuery('#gk_grid_form_add_mobile_w').val(),
					"SIZE_M_H": jQuery('#gk_grid_form_add_mobile_h').val(),
					"SIZE_DATA": ''
				};
				// generate an ID
				var iterator = 1;
				while(jQuery('#gk_grid_blocks_list li[data-id="'+results.POSITION+'-'+iterator+'"]').length > 0) {
					iterator++;
				}
				results.ID = results.POSITION + '-' + iterator;
				// generate a color
				var colorIterator = 1;
				while(jQuery('#gk_grid_blocks_list i[data-colorid="'+colorIterator+'"]').length > 0) {
					colorIterator++;
				}
				// use up to 80 blocks ;)
				if(colorIterator > 40) {
					colorIterator = 1;
					while(jQuery('#gk_grid_blocks_list i[data-colorid="'+colorIterator+'"]').length > 1) {
						colorIterator++;
					}
				}
				results['COLOR_ID'] = colorIterator;
				// generate the size data
				results['SIZE_DATA'] = 	results['SIZE_D_W'] + ',' + 
										results['SIZE_D_H'] + ',' + 
										results['SIZE_T_W'] + ',' + 
										results['SIZE_T_H'] + ',' + 
										results['SIZE_M_W'] + ',' + 
										results['SIZE_M_H'];
				// check the most important data
				var validation = true;
				var errorInfo = '';
				
				if(results['SIZE_D_W'] > 6) {
					validation = false;
					errorInfo += GKGridManagerLang["LIST_ERROR_DESKTOP"] + "\n";
				}
				
				if(results['SIZE_T_W'] > 4) {
					validation = false;
					errorInfo += GKGridManagerLang["LIST_ERROR_TABLET"] + "\n";
				}
				
				if(results['SIZE_M_W'] > 2) {
					validation = false;
					errorInfo += GKGridManagerLang["LIST_ERROR_MOBILE"] + "\n";
				}
				
				if(!validation) {
					alert(errorInfo);
					return;
				}
				// if the data are ok - store it
				blockList.push(results);
				updateJSON();
				// and add the new block to list
				var tpl = listItem;
				for(var field in results) {
					var re = new RegExp('{{'+field+'}}', 'g');
					tpl = tpl.replace(re, results[field]);
				}
				
				blockListUL.append(jQuery(tpl));
				jQuery('#gk_grid_form_add_cancel').trigger('click');
			});
		};
		// public API of the module
		var API = {
	    	init: function() {
	    		readJSON();
	    		renderItems();
	    		initBasicEvents();
	    		initAddForm();
	    		calculatePreview('desktop', true);
				calculatePreview('tablet', true);
				calculatePreview('mobile', true);
	    	},
	    	refresh: function(which) {
	    		calculatePreview(which);
	    	}
	  	};
	  	
	  	return API;
	})();

	var gridManager = GKGridManager;
	gridManager.init();
	
	jQuery('#jform_params_grid_proportions_desktop').keyup(function() { gridManager.refresh('desktop'); });
	jQuery('#jform_params_grid_proportions_tablet').keyup(function() { gridManager.refresh('tablet'); });
	jQuery('#jform_params_grid_proportions_mobile').keyup(function() { gridManager.refresh('mobile'); });
});

// add spinners in browsers without input[type="number"] support
var inputTypeNumber = document.createElement("input");
inputTypeNumber.setAttribute("type", "number");
if(!(inputTypeNumber.type === "number")){
	jQuery(document).ready(function() {
		jQuery('input[type=number]').each(function() {  
			var $input = jQuery(this);  
		    $input.spinner({  
	            min: $input.attr('min'),  
	            max: $input.attr('max'),  
	            step: $input.attr('step')  
		    });  
		});  
	});
}