
function Menu()
{
	this.parentMenu = false;
	this.childMenu = false;
	this.open = false; //true only if it's the current menu being looked at
	this.descriptions = false; //True only if at least one menu item comes with a description
	this.onEnter = function(){};
	this.selectedIndex = 0;
	this.html = 
	{
		menu: false,
		items: [],
		descriptions: [],
	}
}


Menu.prototype.getSelectedIndex = function(){return this.selectedIndex;}


Menu.prototype.getSelectedText = function(){return this.html.items[this.selectedIndex].innerHTML;}


Menu.prototype.createMenuElement = function(id)
{
	var menu = $("<div id=\"" + id + "\" class=\"menu menu-hide\"></div>")[0];
	this.html.menu = menu;
	//Append to the menu contain
	$(menu).appendTo("#menu-container");
}


Menu.prototype.createTitleElement = function(title)
{
	$("<div class=\"menu-title\">" + title + "</div>").appendTo(this.html.menu);
}


Menu.prototype.createItemContainerElement = function()
{
	var itemContainer = $("<div class=\"menu-item-container\"></div>")[0];
	if (this.descriptions)
		$(itemContainer).addClass("description-menu-item-container");
	$(itemContainer).appendTo(this.html.menu);
}


Menu.prototype.createDescriptionContainerElement = function()
{
	$("<div class=\"menu-item-description-container\"></div>").appendTo(this.html.menu);
}


Menu.prototype.addItem = function(itemText)
{
	var item = $(`<div class="menu-item">${itemText}</div>`)[0];
	if (this.html.items.length === this.selectedIndex)
		$(item).addClass("menu-item-selected");
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




function StaticMenu(args)
{
	this.type = "STATIC";
	this.initialize(args);
}


StaticMenu.prototype = new Menu();


StaticMenu.prototype.initialize = function(args)
{
	var menuObject = this;
	//Do some error checking
	if (typeof args.items === "undefined")
	{
		console.log("Your argument array must have an 'items' property.");
		return false;
	}
	if (typeof args.id === "undefined")
	{
		console.log("You argument array must have an 'id' property.");
		return false;
	}
	var items = args.items;
	var id = args.id;
	var descriptions = false;
	var title = false;
	var openWith = false;
	var onEnter = false;
	if (typeof args.descriptions !== "undefined")
	{
		this.descriptions = true;
		descriptions = args.descriptions;
	}
	if (typeof args.title !== "undefined")
		title = args.title;
	if (typeof args.openWith !== "undefined")
	{
		if (!isNaN(Number(args.openWith)))
		{
			openWith = Number(args.openWith);
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
	//Set up the html
	this.createMenuElement(id);
	//Create a menu title, if there is one
	if (title)
		this.createTitleElement(title);
	//Create item container
	this.createItemContainerElement();
	//Create a description container, if there are descriptions
	if (descriptions)
		this.createDescriptionContainerElement();
	//Add items to the item container
	$(items).each(function(index, itemText){
		menuObject.addItem(itemText);
	});
	//Add descriptions, if they exist
	if (descriptions)
	{
		$(descriptions).each(function(index, descriptionText){
			menuObject.addDescription(descriptionText);
		});
	}
	//Add the menu to the global menu array
	global_menus.menus.push(this);
	//Add the toggle on this key thing
	if (openWith !== false && openWith !== 27)
		global_menus.toggleKeyCodes.push(openWith);
}






function DynamicMenu(args)
{
	this.type = "DYNAMIC";
	this.itemArray;
	this.getItemText;
	this.getDescriptionText;
	this.initialize(args);
}


DynamicMenu.prototype = new Menu;


DynamicMenu.prototype.initialize = function(args)
{
	var menuObject = this;
	//Do some error checking
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
	else if (typeof args.items[0] !== "object")
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
	var items = args.items;
	this.itemArray = items;
	var id = args.id;
	this.getItemText = args.getItemText;
	var title = false;
	var openWith = false;
	var descriptions = false;
	var onEnter = false;
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
	this.createMenuElement(id);
	if (title)
		this.createTitleElement(title);
	this.createItemContainerElement();
	if (this.descriptions)
	{
		this.createDescriptionContainerElement();
	}
	global_menus.menus.push(this);
	if (openWith !== false && openWith !== 27)
		global_menus.toggleKeyCodes.push(openWith);
}


DynamicMenu.prototype.update = function()
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


DynamicMenu.prototype.clearItems = function()
{
	$(this.html.menu).find(".menu-item-container").empty();
	this.html.items = [];
}


DynamicMenu.prototype.clearDescriptions = function()
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
	//If it's a dynamic menu, update it
	if (this.openMenu.type === "DYNAMIC")
		this.openMenu.update();
	$(menuToShow).removeClass("menu-hide").addClass("menu-show");
}


//Closes whatever menu is open
global_menus.close = function()
{
	$(".menu-show").removeClass("menu-show").addClass("menu-hide");
	this.openMenu = false;
}



global_menus.selectUp = function()
{
	var selectedIndex;
	$(this.openMenu.html.items).each(function(index, item)
	{
		if ($(item).hasClass("menu-item-selected"))
		{
			selectedIndex = index - 1;
			return false;
		}
	});
	if (selectedIndex >= 0) //As long as the previously selected item isn't the last item
	{
		$(this.openMenu.html.items[selectedIndex + 1]).removeClass("menu-item-selected");
		$(this.openMenu.html.items[selectedIndex]).addClass("menu-item-selected");
		this.openMenu.selectedIndex = selectedIndex;
		if (this.openMenu.descriptions)
		{
			$(this.openMenu.html.descriptions[selectedIndex + 1]).addClass("menu-item-description-hidden");
			$(this.openMenu.html.descriptions[selectedIndex]).removeClass("menu-item-description-hidden");
		}
	}
}


global_menus.selectDown = function()
{
	var selectedIndex;
	$(this.openMenu.html.items).each(function(index, item)
	{
		if ($(item).hasClass("menu-item-selected"))
		{
			selectedIndex = index + 1;
			return false;
		}
	});
	if (selectedIndex < this.openMenu.html.items.length) //As long as the previously selected item isn't the first item
	{
		$(this.openMenu.html.items[selectedIndex - 1]).removeClass("menu-item-selected");
		$(this.openMenu.html.items[selectedIndex]).addClass("menu-item-selected");
		this.openMenu.selectedIndex = selectedIndex;
		if (this.openMenu.descriptions)
		{
			$(this.openMenu.html.descriptions[selectedIndex - 1]).addClass("menu-item-description-hidden");
			$(this.openMenu.html.descriptions[selectedIndex]).removeClass("menu-item-description-hidden");
		}
	}
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


















