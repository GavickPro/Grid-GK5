jQuery.noConflict();

jQuery(document).ready(function() {
	// GKGridManager module
	var GKGridManager = (function () {
		//
		// private fields
		//
		
		// handlers
		var addForm = jQuery('#gk_grid_form_add');
		var blockListUL = jQuery('#gk_grid_blocks_list');
		var dataJSON = jQuery('#jform_params_grid_data');
		// templates
		var listItem = '<li data-id="{{ID}}"><div class="gk_handler"><i class="icon-sign-blank gkColor{{COLOR-ID}}" data-colorid="{{COLOR-ID}}"></i><strong>{{POSITION}}</strong> <span data-size="{{SIZE-DATA}}" class="data-size-info">'+GKGridManagerLang["LIST_SIZE"]+' {{SIZE-D-W}} &times; {{SIZE-D-H}}</span> <i class="icon-remove" data-id="{{ID}}"></i> <i class="icon-pencil" data-id="{{ID}}"></i></div><div class="gk_grid_form_edit"><div><p><label>'+GKGridManagerLang["LIST_POSITION"]+'</label> <span><input type="text" size="15" class="gk_grid_form_add_position" value="{{POSITION}}" /></span></p><p><label>'+GKGridManagerLang["LIST_DESKTOP_SIZE"]+'</label> <span><input type="number" size="1" min="1" max="6" value="{{SIZE-D-W}}" class="gk_grid_form_add_desktop_w" /> &times; <input type="number" size="1" min="1" max="9" value="{{SIZE-D-H}}" class="gk_grid_form_add_desktop_h" /></span></p><p><label>'+GKGridManagerLang["LIST_TABLET_SIZE"]+'</label> <span><input type="number" size="1" min="1" max="4" value="{{SIZE-T-W}}" class="gk_grid_form_add_tablet_w" /> &times; <input type="number" size="1" min="1" max="9" value="{{SIZE-T-H}}" class="gk_grid_form_add_tablet_h" /></span></p><p><label>'+GKGridManagerLang["LIST_MOBILE_SIZE"]+'</label> <span><input type="number" size="1" min="1" max="2" value="{{SIZE-M-W}}" class="gk_grid_form_add_mobile_w" /> &times; <input type="number" size="1" min="1" max="9" value="{{SIZE-M-H}}" class="gk_grid_form_add_mobile_h" /></span></p><p><button class="gk_grid_form_edit_cancel gk_grid_btn" data-id="{{ID}}">'+GKGridManagerLang["LIST_CANCEL"]+'</button><button class="gk_grid_form_edit_save gk_grid_btn" data-id="{{ID}}">'+GKGridManagerLang["LIST_SAVE_BLOCK"]+'</button></p></div></div></li>';
		// data storage
		var blockList = [];
		//
		// private methods
		//
		var updateJSON = function() {
			dataJSON.text(JSON.stringify(blockList));
			calculatePreview('desktop');
			calculatePreview('tablet');
			calculatePreview('mobile');
		};
		
		var readJSON = function() {
			if(dataJSON.text() !== '') {
				blockList = JSON.parse(dataJSON.text());
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
		
		var calculatePreview = function(type) {
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
				for(var i = 0; i < copy[0]['SIZE-' + sizeName + '-W']; i++) {
					preview[i] += 1 * copy[0]['SIZE-' + sizeName + '-H'];
				}
				
				copy[0]['POS-X'] = 0;
				copy[0]['POS-Y'] = 0;
				
				freeX += 1 * copy[0]['SIZE-' + sizeName + '-W']; 
				freeSize = size - freeX;
				
				if(freeX >= size) {
					freeY = 1 * copy[0]['SIZE-' + sizeName + '-H'];
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
						if(copy[x]['SIZE-' + sizeName + '-W'] <= freeSize) {
							// put the element to an array
							for(var y = 0; y < copy[x]['SIZE-' + sizeName + '-W']; y++) {
								preview[freeX + y] += 1 * copy[x]['SIZE-' + sizeName + '-H'];
							}
							
							copy[x]['POS-X'] = freeX;
							copy[x]['POS-Y'] = freeY;
							
							min = preview[0];
							freeX = 0;
							
							for(var z = 1; z < size; z++) {
								if(preview[z] < min) {
									freeX = z;
									min = preview[z];
								}
							} 
							
							freeY = preview[freeX];
							
							freeSize = 1;
							
							for(var o = freeX+1; o < size; o++) {
								if(preview[o] === freeY) {
									freeSize++;
								} else {
									break;
								}
							}
							
							results.push(copy[x]);
							copy.splice(x, 1);
							
							itemAdded = true;
							break;
						}
					}
					// if item wasn't added - work to fill the empty fields and start again
					if(!itemAdded) {					
						//[DEV]console.log('START', preview, freeX, freeY, freeSize);
						for(var a = freeX; (a < freeX + (freeSize === 0 ? 1 : freeSize)) && (a < size); a++) {
							if(preview[a] <= freeY) {
								preview[a] += 1.0;
							}
						}
						
						//[DEV]console.log(preview);
						
						if(freeSize > 0) {
							freeX = freeX + freeSize;
							
							if(preview[freeX] > freeY) {
								var founded = false;
								
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
							freeX++;
						}
											
						if(freeX >= size) {
							freeY++;
							
							min = preview[0];
							freeX = 0;
							
							for(var z = 1; z < size; z++) {
								if(preview[z] < min) {
									freeX = z;
									min = preview[z];
								}
							}
						}
					
						if(freeX+1 < size) {
							for(var o = freeX + ((freeSize === 0) ? 0 : 1); o < size; o++) {
								if(preview[o] === freeY) {
									freeSize++;
								} else {
									break;
								}
							}
						} else {
							freeSize = 0;
						}
						
						//[DEV]console.log('END', freeX, freeY, freeSize);
					}
				}
				
				renderPreview(size, sizeName, results, preview, type);
			} else {
				jQuery('#gk_grid_desktop_preview').html('<p>' + GKGridManagerLang["GRID_NO_BLOCKS"] + '</p>').css('height', 'auto');	
				jQuery('#gk_grid_tablet_preview').html('<p>' + GKGridManagerLang["GRID_NO_BLOCKS"] + '</p>').css('height', 'auto');	
				jQuery('#gk_grid_mobile_preview').html('<p>' + GKGridManagerLang["GRID_NO_BLOCKS"] + '</p>').css('height', 'auto');	
			}
		}
		
		var renderPreview = function(size, sizeName, results, preview, type) {
			var area = jQuery('#gk_grid_'+type+'_preview');
			// find the max value in preview
			var max = preview[0];
			for(var m = 1; m < size; m++) {
				if(preview[m] > max) {
					max = preview[m];
				}
			}
			// set a new height;
			area.css('height', max * 25 + "px");
			// generate the output
			var htmlOutput = '';
			
			for(var i = 0, len = results.length; i < len; i++) {
				htmlOutput += '<div class="gkGridElm gkColor'+results[i]['COLOR-ID']+'" data-id="'+results[i]['ID']+'" style="width: '+(results[i]['SIZE-'+sizeName+'-W'] * 25)+'px; height: '+(results[i]['SIZE-'+sizeName+'-H'] * 25)+'px; top: '+((results[i]['POS-Y'] * 25)+2)+'px; left: '+((results[i]['POS-X'] * 25)+2)+'px;"></div>';
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
					(jQuery(e.target).prop('tagName') == 'I' && jQuery(e.target).hasClass('icon-pencil')) ||
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
					blockList[num]["SIZE-D-W"] = blockListUL.find('li[data-id="'+ID+'"] .gk_grid_form_add_desktop_w').val();
					blockList[num]["SIZE-D-H"] = blockListUL.find('li[data-id="'+ID+'"] .gk_grid_form_add_desktop_h').val();
					blockList[num]["SIZE-T-W"] = blockListUL.find('li[data-id="'+ID+'"] .gk_grid_form_add_tablet_w').val();
					blockList[num]["SIZE-T-H"] = blockListUL.find('li[data-id="'+ID+'"] .gk_grid_form_add_tablet_h').val();
					blockList[num]["SIZE-M-W"] = blockListUL.find('li[data-id="'+ID+'"] .gk_grid_form_add_mobile_w').val();
					blockList[num]["SIZE-M-H"] = blockListUL.find('li[data-id="'+ID+'"] .gk_grid_form_add_mobile_w').val();
					blockList[num]['SIZE-DATA'] = 	blockList[num]['SIZE-D-W'] + ',' + 
													blockList[num]['SIZE-D-H'] + ',' + 
													blockList[num]['SIZE-T-W'] + ',' + 
													blockList[num]['SIZE-T-H'] + ',' + 
													blockList[num]['SIZE-M-W'] + ',' + 
													blockList[num]['SIZE-M-H'];
					// update the list block element
					blockListUL.find('li[data-id="'+ID+'"] > div > strong').text(blockList[num]["POSITION"]);
					blockListUL.find('li[data-id="'+ID+'"] > div > span').html('Size: ' + blockList[num]["SIZE-D-W"] + ' &times; ' + blockList[num]["SIZE-D-H"]);
					// close the form - remove the active class from form
					jQuery('#gk_grid_blocks_list li[data-id="'+ID+'"] .gk_grid_form_edit').removeClass('active');
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
					"COLOR-ID": '',
					"POSITION": jQuery('#gk_grid_form_add_position').val(),
					"SIZE-D-W": jQuery('#gk_grid_form_add_desktop_w').val(),
					"SIZE-D-H": jQuery('#gk_grid_form_add_desktop_h').val(),
					"SIZE-T-W": jQuery('#gk_grid_form_add_tablet_w').val(),
					"SIZE-T-H": jQuery('#gk_grid_form_add_tablet_h').val(),
					"SIZE-M-W": jQuery('#gk_grid_form_add_mobile_w').val(),
					"SIZE-M-H": jQuery('#gk_grid_form_add_mobile_w').val(),
					"SIZE-DATA": ''
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
				results['COLOR-ID'] = colorIterator;
				// generate the size data
				results['SIZE-DATA'] = 	results['SIZE-D-W'] + ',' + 
										results['SIZE-D-H'] + ',' + 
										results['SIZE-T-W'] + ',' + 
										results['SIZE-T-H'] + ',' + 
										results['SIZE-M-W'] + ',' + 
										results['SIZE-M-H'];
				// check the most important data
				var validation = true;
				var errorInfo = '';
				
				if(results['SIZE-D-W'] > 6) {
					validation = false;
					errorInfo += GKGridManagerLang["LIST_ERROR_DESKTOP"] + "\n";
				}
				
				if(results['SIZE-T-W'] > 4) {
					validation = false;
					errorInfo += GKGridManagerLang["LIST_ERROR_TABLET"] + "\n";
				}
				
				if(results['SIZE-M-W'] > 2) {
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
	    		calculatePreview('desktop');
	    		calculatePreview('tablet');
	    		calculatePreview('mobile');
	    	}
	  	};
	  	
	  	return API;
	})();

	var gridManager = GKGridManager;
	gridManager.init();
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