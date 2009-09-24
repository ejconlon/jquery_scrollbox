// jquery.scrollbox.js
// Copyright 2009 Eric Conlon,
// Open source and without warranty under the MIT license, 
// http://www.opensource.org/licenses/mit-license.php

function max(num1, num2) { if (num1 > num2) {return num1;} else {return num2;} }
function min(num1, num2) { if (num1 < num2) {return num1;} else {return num2;} }
function abs(num) { if (num > 0) {return num;} else {return -num;} }
function parseIntNaNSafe(s){ 
	sp = parseInt(s); 
	if (isNaN(sp)) { sp = 0; } 
	return sp; 
}

function getTotWidth(elem){
	t = 0;
	t += parseIntNaNSafe(elem.width());
	t += parseIntNaNSafe(elem.css('margin-left'));
	t += parseIntNaNSafe(elem.css('margin-right'));
	t += parseIntNaNSafe(elem.css('padding-left'));
	t += parseIntNaNSafe(elem.css('padding-right'));
	t += parseIntNaNSafe(elem.css('border-width-left'));
	t += parseIntNaNSafe(elem.css('border-width-right'));
	return t;
}

function getTotHeight(elem){
	t = 0;
	t += parseIntNaNSafe(elem.height());
	t += parseIntNaNSafe(elem.css('margin-top'));
	t += parseIntNaNSafe(elem.css('margin-bottom'));
	t += parseIntNaNSafe(elem.css('padding-top'));
	t += parseIntNaNSafe(elem.css('padding-bottom'));
	t += parseIntNaNSafe(elem.css('border-width-top'));
	t += parseIntNaNSafe(elem.css('border-width-bottom'));
	return t;
}

jQuery.fn.scrollbox = function(options) {
	
	var scrollbox = new Object();
	scrollbox.caller_ref = this;
	scrollbox.test = "TEST!";

	scrollbox.enableNext = function(self){
		if (self === undefined) { alert("MISSING ARGUMENT"); }
		self.nextEnabled = true;
		jQuery(self.nextSelector).removeClass(self.fadeClass);
	};
	scrollbox.disableNext = function(self){
		if (self === undefined) { alert("MISSING ARGUMENT"); }
		//alert("disableNext");
		self.nextEnabled = false;
		jQuery(self.nextSelector).addClass(self.fadeClass);
	};
	
	scrollbox.enablePrev = function(self){
		if (self === undefined) { alert("MISSING ARGUMENT"); }
		self.prevEnabled = true;
		jQuery(self.prevSelector).removeClass(self.fadeClass);
	};
	scrollbox.disablePrev = function(self){
		if (self === undefined) { alert("MISSING ARGUMENT"); }
		self.prevEnabled = false;
		jQuery(self.prevSelector).addClass(self.fadeClass);
	};
	
	scrollbox.alertItems = function(self, msg){ return;
		if (self === undefined) { alert("MISSING ARGUMENT"); }
		self.alertObject(self, msg, self.items)
	};
	
	scrollbox.alertObject = function(self, msg, object){
		if (self === undefined) { alert("MISSING ARGUMENT"); }
		s = "{";
		for (var i in object){
			s += i+" : "+object[i]+", ";
		}
		s += "}";
		alert(msg+": "+s);
	};
	
	scrollbox.getItemByPos = function(self, pos){
		if (self === undefined) { alert("MISSING ARGUMENT"); }
		if (pos < 0 || pos >= self.items.length) { return null; }
		return self.items[pos];
	};
	
	scrollbox.preloadPrev = function(self){
		if (self === undefined) { alert("MISSING ARGUMENT"); }
		if (self.idCur > 0){
			var pos = self.idCur - 1;
			self.items[pos] = self.getItemByPos(self, pos);
			
			if (self.prevEnabled == false){
				self.enablePrev(self);
			}
		} else {
			if (self.prevEnabled == true){
				self.disablePrev(self);
			}
		}
	};
	
	scrollbox.preloadNext = function(self){
		if (self === undefined) { alert("MISSING ARGUMENT"); }
		if (self.idCur + self.numShown < self.items.length){
			var pos = self.idCur + self.numShown;
			self.items[pos] = self.getItemByPos(self, pos);
			
			if (self.nextEnabled == false){
				self.enableNext(self);
			}
		} else {
			if (self.nextEnabled == true){
				self.disableNext(self);
			}
		}
	};
	
	scrollbox.getNext = function(self){
		if (self === undefined) { alert("MISSING ARGUMENT"); }
		if (self.idCur + self.numShown < self.items.length){
			var pos = self.idCur + self.numShown;
			return self.items[pos];
		} else {
			return null;
		}
	};
	
	scrollbox.getPrev = function(self){
		if (self === undefined) { alert("MISSING ARGUMENT"); }
		if (self.idCur > 0){
			var pos = self.idCur - 1;
			return self.items[pos];
		} else {
			return null;
		}
	};
	
	scrollbox.fixSize = function(self){ 
		if (self === undefined) { alert("MISSING ARGUMENT"); }
		if (self.vertical){
			jQuery(function(){
				var i = self.idCur;
				var oldHeight = getTotHeight(self.items[i])
				var totHeight = oldHeight;
				var numOk = 1;
				i++;
				while (i < self.idCur + self.numShown){
					totHeight += getTotHeight(self.items[i]);
					//alert('yo: '+totHeight);
					if (totHeight > self.maxHeight){
						//alert('go: '+min(oldHeight, self.maxHeight));
						jQuery(self.elemSelector).animate( {height:min(oldHeight, self.maxHeight)}, "fast");
						return numOk;
					}
					oldHeight = totHeight
					numOk++;
					i++;
				}
				var newHeight = max(self.minHeight, min(totHeight, self.maxHeight));
				//alert('go2: '+newHeight);
				jQuery(self.elemSelector).animate( {height:newHeight}, "fast" );
				return numOk;
			});
		} else {
			jQuery(function(){
				var i = self.idCur; //alert("IDCUR="+i);
				var oldWidth = getTotWidth(self.items[i]);
				var totWidth = oldWidth;
				var numOk = 1;
				i++;
				while (i < self.idCur + self.numShown){
					totWidth += getTotWidth(self.items[i]);
					if (totWidth > self.maxWidth){
						jQuery(self.elemSelector).animate( {width:min(oldWidth, self.maxWidth)}, "fast" );
						return numOk;
					}
					oldWidth = totWidth
					numOk++;
					i++;
				}
				var newWidth = max(self.minWidth, min(totWidth, self.maxWidth));
				jQuery(self.elemSelector).animate( {width:newWidth}, "fast" );
				return numOk;
			});
		}
	};
	
	scrollbox.scrollPrev = function(self){
		if (self === undefined) { alert("MISSING ARGUMENT"); }
		if (self.scrolling) {return;}
		if (self.idCur > 0){
			self.scrolling = true;
			self.alertItems("Before scrollPrev");
			var prev = self.getPrev(self);
			self.idCur--; var pos = self.idCur;
			self.fixSize(self);
			prev.fadeIn();
			//prev.css('opacity',0);
			//prev.css('display','inline');
			prev.animate({opacity: 1.0},"fast");
			if (self.idCur+self.numShown < self.items.length){
				self.items[self.idCur+self.numShown].animate({opacity: 0},"fast")
			}
			if (self.vertical){
				var targetOffset = self.items[self.idCur].offset().top -
				 jQuery(self.elemSelector).offset().top;
				jQuery(self.elemSelector).animate({scrollTop: "+=" + targetOffset + "px"},
				 "fast", "swing", function(){
					self.scrolling = false;																				
				});				
			} else {
				//var targetOffset = self.items[self.idCur].offset().left -
				// jQuery(self.elemSelector).offset().left;
				var targetOffset = self.items[self.idCur].offset().left - self.items[0].offset().left;
				jQuery(self.elemSelector).animate({scrollLeft:  targetOffset + "px"},
				 "fast", "swing", function(){
					self.scrolling = false;																				
				});	
			}
			self.preloadPrev(self);
			self.preloadNext(self);
			self.alertItems(self, "After scrollPrev");
		}
	};
	
	scrollbox.scrollNext = function(self){
		if (self === undefined) { alert("MISSING ARGUMENT"); }
		if (self.scrolling) {return;}
		if (self.idCur + self.numShown < self.items.length){
			self.scrolling = true;
			self.alertItems(self, "Before scrollNext");
			var next = self.getNext(self);
			self.idCur++; var pos = self.idCur + self.numShown - 1;
			self.fixSize(self);
			next.fadeIn();
			next.animate({opacity: 1.0},"fast");
			if (self.idCur - 1 >= 0){
				self.items[self.idCur-1].animate({opacity: 0},"fast");
			}
			if (self.vertical){
				var targetOffset = self.items[self.idCur].offset().top -
				 jQuery(self.elemSelector).offset().top;
				jQuery(self.elemSelector).animate({scrollTop: "+=" + targetOffset + "px"}, "fast", "swing", function(){
					self.scrolling = false;																				
				});					
			} else {
				//var targetOffset = self.items[self.idCur].offset().left -
				// jQuery(self.elemSelector).offset().left;
				var targetOffset = self.items[self.idCur].offset().left - self.items[0].offset().left;
				jQuery(self.elemSelector).animate({scrollLeft:  targetOffset + "px"}, "fast", "swing", function(){
					self.scrolling = false;																				
				});	
			}
			self.preloadPrev(self);
			self.preloadNext(self);
			self.alertItems(self, "After scrollNext");
		}
	};
	
	scrollbox.init = function(self, options){
		if (self === undefined) { alert("MISSING ARGUMENT"); }
		// self is the scrollbox namespace, this.selfref is above somewhere
		//alert("test : "+self.test);
		
		//self.alertObject(self, "Caller ref", self.caller_ref);
		
		//alert(self.caller_ref.selector);
		 
		var defElemId = self.caller_ref.selector.substring(1)
		var defaults = {
			vertical 		: false,
			elemId 			: defElemId, // no # - id not selector 
			subElemSelector	: "#"+defElemId+"_sub",
			itemSelector 	: "#"+defElemId+" > *", // include the . for class
			nextSelector 	: "."+defElemId+"_next",
			prevSelector 	: "."+defElemId+"_prev",
			numShown 		: 3,
			fadeClass 		: "fade", // class name, no .
			maxWidth 		: 10000000000000,
			minWidth 		: 0,
			maxHeight 		: 10000000000000,
			minHeight 		: 0
		};
		
		for (var i in defaults){
			if (options[i] === undefined){
				self[i] = defaults[i];
			} else {
				self[i] = options[i];
			}
		}
		self.elemSelector = "#"+self.elemId;

		self.numItems = jQuery(self.itemSelector).size();
		
		self.idCur = 0; 
		self.items = [];
		self.items.length = self.numItems;
		self.next = null; 
		self.prev = null;
		self.nextEnabled = true;
		self.prevEnabled = false;
		self.curOffset = 0;
		self.scrolling = false;

		var elem = jQuery(self.elemSelector);
				
		var subElem = jQuery(document.createElement('div'));
		subElem.attr('id', self.subElemSelector.substring(1));
		subElem.css('border', 'none').css('margin', 'none').css('padding', 'none');
		if (self.vertical){ subElem.css('height', 100000); }
		else { 			    subElem.css('width' , 100000); }
				
		
		var i = 0;
		while (i < self.items.length){ self.items[i] = null; i++; }
		i = 0;
		jQuery(self.itemSelector).each(function(){
			var thisItem = jQuery(this);
			thisItem.remove();
			self.items[i] = thisItem;	
			subElem.append(thisItem);
			i++;
		});
	
		elem.append(subElem);
		
		elem.css('position', 'relative');
		subElem.css('position', 'absolute').css('float', 'left');
		elem.css('overflow', 'hidden');
		
		jQuery(self.itemSelector).css('opactiy', 1.0);
		
		if (self.options){
			if (!self.options.maxHeight){
				self.maxHeight = parseInt(jQuery(self.elemSelector).css('height'));	
			}
			if (!self.options.maxWidth){
				self.maxWidth = parseInt(jQuery(self.elemSelector).css('width'));
			}
		}
		
		self.preloadPrev(self);
		self.preloadNext(self);
		
		jQuery(self.nextSelector).click(function(){self.scrollNext(self);});
		jQuery(self.prevSelector).click(function(){self.scrollPrev(self);});	
	
		self.fixSize(self);
		if (self.vertical){
				var targetOffset = self.items[self.idCur].offset().top -
				 jQuery(self.elemSelector).offset().top;
				jQuery(self.elemSelector).animate({scrollTop: "+=" + targetOffset + "px"});				
		} else {
				var targetOffset = self.items[self.idCur].offset().left -
				 jQuery(self.elemSelector).offset().left;
				jQuery(self.elemSelector).animate({scrollLeft: "+=" + targetOffset + "px"});
		}
		
		self.disablePrev(self);
	};
	
	// initialize the object, store it, and send this for chaining
	scrollbox.init(scrollbox, options);
	jQuery(scrollbox.elemSelector).attr('scrollbox_obj', scrollbox);
	return jQuery(this);

};