
function Menu()
{
	this.parentMenu = false;
	this.childMenu = false;
	this.open = false; //true only if it's the current menu being looked at
	this.descriptions = false; //True only if at least one menu item comes with a description
	this.onEnter = function(){};
	this.selectedIndex = 0;
	this.type = "MENU";
	this.itemArray;
	this.getItemText;
	this.getDescriptionText;
	this.wrap = false;
	this.topItemDisplayed = 0; //Index of the item being displayed at the top of the menu (higher than 0 if the meny is scrolled down)
	this.maxItemsDisplayed = "NONE"; //Maximum number of items displayed (if lower than total number of items in the menu, menu will scroll)
	this.html = 
	{
		menu: false,
		items: [],
		descriptions: [],
	}

	this.initialize(args);
}


Menu.prototype.getSelectedIndex = function(){return this.selectedIndex;}


Menu.prototype.getSelectedText = function(){return this.html.items[this.selectedIndex].innerHTML;}


Menu.prototype.createMenuElement = function(id, width)
{
	var sideMargin = (100 - width) / 2;
	var menu = $(`<div id="${id}" class="menu menu-hide"
		style="width:${width}%; margin-left:${sideMargin}%; margin-right:${sideMargin}%;"
		></div>`)[0];
	this.html.menu = menu;
	//Append to the menu contain
	$(menu).appendTo("#menu-container");
}


Menu.prototype.createTitleElement = function(title)
{
	$("<div class=\"menu-title\">" + title + "</div>").appendTo(this.html.menu);
}


Menu.prototype.createItemContainerElement = function(position)
{
	var positionClass = `item-container-${position}`;
	var itemContainer = $(`<div class="menu-item-container ${positionClass}"></div>`)[0];
	if (this.descriptions)
		$(itemContainer).addClass("description-menu-item-container");
	$(itemContainer).appendTo(this.html.menu);
}


Menu.prototype.createDescriptionContainerElement = function(position)
{
	var positionClass = `description-container-${position}`;
	$(`<div class="menu-item-description-container ${positionClass}"></div>`).appendTo(this.html.menu);
}


Menu.prototype.addItem = function(itemText)
{
	var item = $(`<div class="menu-item">${itemText}</div>`)[0];
	if (this.html.items.length === this.selectedIndex)
		$(item).addClass("menu-item-selected");
	var itemOutOfDisplayRange = this.html.items.length < this.topItemDisplayed
								|| this.html.items.length >= this.topItemDisplayed + this.maxItemsDisplayed;
	if (itemOutOfDisplayRange)
		$(item).addClass("menu-item-hidden");
	$(item).appendTo($(this.html.menu).find(".menu-item-container"));
	this.html.items.push(item);
}


Menu.prototype.addDescription = function(descriptionText)
{
	var desc = $(`<div class="menu-item-description">${descriptionText}</div>`)[0];
	if (this.html.descriptions.length !== this.selectedIndex) //If this isn't the description of the selected menu item
		$(desc).addClass("menu-item-description-hidden");
	$(desc).appendTo($(this.html.menu).find(".menu-item-description-container"));
	this.html.descriptions.push(desc);
}


//Makes sure the arguments passed into the menu initializer are valid
Menu.prototype.validArguments = function(args)
{
	if (typeof args.items === "undefined")
	{
		console.log("Your argument array must have an 'items' property.");
		return false;
	}
	else if (typeof args.items !== "object")
	{
		console.log("The 'items' property of the argument of a dynamic array constructor must be an array.");
		return false;
	}
	if (typeof args.getItemText === "undefined")
	{
		console.log("Your argument array must have an 'itemTextProperty' property.");
		return false;
	}
	else if (typeof args.getItemText !== "function")
	{
		console.log("The 'getItemText' property must be a function.");
		return false;
	}
	if (typeof args.id === "undefined")
	{
		console.log("You argument array must have an 'id' property.");
		return false;
	}
}



Menu.prototype.initialize = function(args)
{
	var menuObject = this;
	//Do some error checking
	if (this.validArguments(args) === false)
		return false;

	var items = args.items;
	this.itemArray = items;
	var id = args.id;
	this.getItemText = args.getItemText;
	var title = false;
	var openWith = false;
	var descriptions = false;
	var onEnter = false;
	var width = 50;
	var maxItemsDisplayed = "NONE";
	var wrap = true;
	var descriptionPosition = false;
	var itemPosition = "FULL";
	if (typeof args.title !== "undefined")
		title = args.title;
	if (typeof args.openWith !== "undefined")
	{
		if (!isNaN(Number(args.openWith)))
		{
			openWith = Number(args.openWith);
		}
	}
	if (typeof args.getDescriptionText !== "undefined")
	{
		if (typeof args.getDescriptionText !== "function")
		{
			console.log("The 'getDescriptionText' property must be a function.");
		}
		else
		{
			this.descriptions = true;
			this.getDescriptionText = args.getDescriptionText;
			descriptionPosition = "RIGHT";
		}
	}
	if (typeof args.onEnter !== "undefined")
	{
		if (typeof args.onEnter === "function")
		{
			onEnter = true;
			this.onEnter = args.onEnter;
		}
		else
		{
			console.log("The 'onEnter' property must be a function.");
		}
	}
	if (typeof args.width !== "undefined")
	{
		if (args.width % 2 !== 0 || args.width > 100)
		{
			console.log("The 'width' property must be an even number less than or equal to 100.");
		}
		else
		{
			width = args.width;
		}
	}
	if (typeof args.maxItemsDisplayed !== "undefined")
	{
		if (typeof args.maxItemsDisplayed !== "number")
		{
			console.log("The 'maxItemsDisplayed' property must be a number.")
		}
		else
		{
			maxItemsDisplayed = args.maxItemsDisplayed;
		}
	}
	if (typeof args.wrap !== "undefined")
	{
		if (typeof args.wrap !== "boolean")
		{
			console.log("The 'wrap' property must be a boolean.");
		}
		else
		{
			wrap = args.wrap;
		}
	}
	if (typeof args.descriptionPosition !== "undefined")
	{
		if (this.descriptions === false)
		{
			console.log("You must have a valid 'description' argument to define a 'descriptionPosition' argument.");
		}
		else
		{
			var acceptablePositions = ["RIGHT", "BOTTOM", "LEFT", "TOP"];
			if (acceptablePositions.indexOf(args.descriptionPosition) === -1)
			{
				console.log("The 'descriptionPosition' property must be one of these options: " + acceptablePositions);
			}
			else
			{
				descriptionPosition = args.descriptionPosition;
			}
			//Set menu item position 
			if (descriptionPosition === "RIGHT")
				itemPosition = "LEFT";
			else if (descriptionPosition === "BOTTOM")
				itemPosition = "TOP";
			else if (descriptionPosition === "LEFT")
				itemPosition = "RIGHT";
			else if (descriptionPosition === "TOP")
				itemPosition = "BOTTOM";
		}
	}
	this.createMenuElement(id, width);
	this.maxItemsDisplayed = maxItemsDisplayed;
	global_menus.menus.push(this);
	if (title)
		this.createTitleElement(title);
	if (this.descriptions && (descriptionPosition === "TOP" || descriptionPosition === "LEFT" ))
		this.createDescriptionContainerElement(descriptionPosition);
	this.createItemContainerElement(itemPosition);
	if (this.descriptions && (descriptionPosition === "BOTTOM" || descriptionPosition === "RIGHT" ))
		this.createDescriptionContainerElement(descriptionPosition);
	if (wrap)
		this.wrap = wrap;
	if (openWith !== false && openWith !== 27)
		global_menus.toggleKeyCodes.push(openWith);
}


Menu.prototype.update = function()
{
	var menuObject = this;
	//Clear the items container
	this.clearItems();
	//If the selected index is now too large because items were removed
	if (this.selectedIndex >= this.itemArray.length)
		this.selectedIndex = this.itemArray.length - 1;
	$(this.itemArray).each(function(index, item){
		menuObject.addItem(menuObject.getItemText(item));
	});
	//If the menu has descriptions, do the same with descriptions
	if (this.descriptions)
	{
		this.clearDescriptions();
		$(this.itemArray).each(function(index, item){
			menuObject.addDescription(menuObject.getDescriptionText(item));
		});
	}
}


Menu.prototype.clearItems = function()
{
	$(this.html.menu).find(".menu-item-container").empty();
	this.html.items = [];
}


Menu.prototype.clearDescriptions = function()
{
	$(this.html.menu).find(".menu-item-description-container").empty();
	this.html.descriptions = [];
}

//var array = ["a"];
//var m = new DynamicMenu(array);



////////////////////////

var global_menus = 
{
	openMenu: false,
	menus: [],
	toggleKeyCodes: [], //The key codes of the buttons that open the menu
};



global_menus.initialize = function()
{
	//Create the "menu container" DOM element and add all the menus to it
	$("<div id=\"menu-container\"></div>").appendTo(document.body);
	//Add the enter key event listener
	$(document).keydown(function(e){
		console.log(e.key);
		//If a key pressed toggles a menu
		if (global_menus.toggleKeyCodes.indexOf(e.which) !== -1)
		{
			var index = global_menus.toggleKeyCodes.indexOf(e.which);
			var menuToToggle = global_menus.menus[index];
			global_menus.toggle(menuToToggle.html.menu.id);
		}
		if (e.which === 13) //If it's the enter key
		{
			//Active the "on enter" function for the open menu, if there is one. 
			if (global_menus.openMenu)
			{
				global_menus.openMenu.onEnter();
			}
		}
		else if (e.which === 27) //If it's the escape key
			global_menus.close();
		else if (e.which === 38) // If it's the up key
			global_menus.selectUp();
		else if (e.which === 40) //If it's the down key
			global_menus.selectDown();
	});
}


//Opens or closes the menu. Only opens it if there isn't another menu open. 
global_menus.toggle = function(menuId)
{
	var menu = this.getMenu(menuId);
	if (this.openMenu === menu)
		this.close();
	else if (this.openMenu === false)
		this.open(menuId);
}

global_menus.open = function(menuId)
{
	//Hide the currently shown menu, if there is one.
	$(".menu-show").removeClass("menu-show").addClass("menu-hide");
	var menuToShow = $("#" + menuId);
	this.openMenu = this.getMenuFromId(menuId);
	this.openMenu.update();
	$(menuToShow).removeClass("menu-hide").addClass("menu-show");
}


//Closes whatever menu is open
global_menus.close = function()
{
	$(".menu-show").removeClass("menu-show").addClass("menu-hide");
	this.openMenu = false;
}



global_menus.selectIndex = function(index)
{

	if (index >= this.openMenu.html.items.length)
		return false;
	$(this.openMenu.html.items[this.openMenu.selectedIndex]).removeClass("menu-item-selected");
	if (this.openMenu.descriptions)
		$(this.openMenu.html.descriptions[this.openMenu.selectedIndex]).addClass("menu-item-description-hidden");
	this.openMenu.selectedIndex = index;
	$(this.openMenu.html.items[index]).addClass("menu-item-selected");
	if (this.openMenu.descriptions)
		$(this.openMenu.html.descriptions[index]).removeClass("menu-item-description-hidden");

	//Scroll the menu if need be
	//If the index is out of view
	var openMenu = this.openMenu;
	var itemOutOfView = index < openMenu.topItemDisplayed || index >= openMenu.topItemDisplayed + openMenu.maxItemsDisplayed;
	//	If the new index is too high
	if (itemOutOfView)
	{
		var newTopItemDisplayed;
		if (index < openMenu.topItemDisplayed)
			newTopItemDisplayed = index;	
		else if (index >= openMenu.topItemDisplayed + openMenu.maxItemsDisplayed)
			newTopItemDisplayed = index - openMenu.maxItemsDisplayed + 1;
		for (var i = openMenu.topItemDisplayed ; i < openMenu.topItemDisplayed + openMenu.maxItemsDisplayed ; i++)
		{
			if (i < newTopItemDisplayed || i >= newTopItemDisplayed + openMenu.maxItemsDisplayed)
			{
				var item = openMenu.html.items[i];
				$(item).addClass("menu-item-hidden");
			}
		}
		//Change index through index + maxItemsDisplayed to visible
		for (var i = newTopItemDisplayed ; i < newTopItemDisplayed + openMenu.maxItemsDisplayed ; i++)
		{
			//If it's not within the old display range, remove the "hidden" class
			if (i < openMenu.topItemDisplayed || i >= openMenu.topItemDisplayed + openMenu.maxItemsDisplayed)
			{
				var item = openMenu.html.items[i];
				$(item).removeClass("menu-item-hidden");
			}
		}
		openMenu.topItemDisplayed = newTopItemDisplayed;
	}
}




global_menus.selectUp = function()
{
	var newIndex;
	if (this.openMenu.selectedIndex === 0)
	{
		if (this.openMenu.wrap)
		{
			newIndex = this.openMenu.html.items.length - 1;
		}
		else
		{
			return false;
		}
	}
	else
	{
		newIndex = this.openMenu.selectedIndex - 1;
	}
	this.selectIndex(newIndex);
}




global_menus.selectDown = function()
{
	var newIndex;
	if (this.openMenu.selectedIndex === this.openMenu.html.items.length - 1)
	{
		if (this.openMenu.wrap)
		{
			newIndex = 0
		}
		else
		{
			return false;
		}
	}
	else
	{
		newIndex = this.openMenu.selectedIndex + 1;
	}
	this.selectIndex(newIndex);
}


global_menus.getMenuFromId = function(menuId)
{
	var returnMenu = false;
	$(this.menus).each(function(index, menu){
		if (menu.html.menu.id == menuId)
		{
			returnMenu = menu;
			return false;
		}
	});
	return returnMenu;
}


global_menus.getMenu = function(menuId)
{
	return global_menus.getMenuFromId(menuId);
}



global_menus.initialize();


















