
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
	$("<div class=\"menu-item-container\"></div>").appendTo(this.html.menu);
}


Menu.prototype.createDescriptionContainerElement = function()
{
	$("<div class=\"menu-item-description-container\"></div>").appendTo(this.html.menu);
}


Menu.prototype.addItem = function(itemText)
{
	var item = $(`<div class="menu-item">${itemText}</div>`)[0];
	if (this.html.items.length === 0)
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
	this.itemTextProperty; //A string representing the name of the item property that corresponds to the item text
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
	if (typeof args.itemTextProperty === "undefined")
	{
		console.log("Your argument array must have an 'itemTextProperty' property.");
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
	this.itemTextProperty = args.itemTextProperty;
	var title = false;
	var openWith = false;
	var descriptions = false;
	if (typeof args.title !== "undefined")
		title = args.title;
	if (typeof args.openWith !== "undefined")
	{
		if (!isNaN(Number(args.openWith)))
		{
			openWith = Number(args.openWith);
		}
	}
	if (typeof args.descriptions !== "undefined")
	{
		this.descriptions = true;
		descriptions = args.descriptions;
	}
	this.createMenuElement(id);
	if (title)
		this.createTitleElement(title);
	this.createItemContainerElement();
	if (descriptions)
		this.createDescriptionContainerElement();
	global_menus.menus.push(this);
	if (openWith !== false && openWith !== 27)
		global_menus.toggleKeyCodes.push(openWith);
}


DynamicMenu.prototype.update = function()
{
	var menuObject = this;
	//Clear the items container
	this.clearItems();
	$(this.itemArray).each(function(index, item){
		menuObject.addItem(item.getMenuText());
	});
	//If the menu has descriptions, do the same with descriptions
	if (this.descriptions)
	{
		this.clearDescriptions();
		$(this.itemArray).each(function(index, item){
			menuObject.addDescription(item.getMenuDescription());
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


$(document).ready(function(){
	var importedNames = ["Menu"];
	$(importedNames).each(function(index, name){
		var imported = document.createElement("script");
		imported.src = name + ".js";
		document.head.appendChild(imported);
	});
	//Add event listeners
	$(document).keydown(function(e)
	{
		if (e.which === 38)
			global_menus.selectUp();
		else if (e.which === 40)
			global_menus.selectDown();
	});
	global_menus.initialize();
});

////////////////////////

var global_menus = 
{
	openMenu: false,
	menus: [],
	toggleKeyCodes: [], //The key codes of the buttons that open the menu
};

global_menus.initialize = function()
{
	var menuElements = $(".menu"); //Get all the menu dom elements
	$(menuElements).each(function(index, menuElement){ //Do stuff to each menu dom element
		$(menuElement).addClass("menu-hide"); //Make the menu element hidden by default
		var menu = new Menu(); //Initialize a menu object
		menu.html.menu = menuElement; //Set the menu object html.menu instance variable to the menu dome object
		menu.html.items = $(menuElement).children(".menu-item"); //Set the menu object html.items instance variable to an array containing the menu item dom objects
		$(menu.html.items).each(function(index, item){ //For each item, if there is a description, add it to menu.html.descriptions
			var desc = $(item).children(".menu-item-description");
			if (desc.length > 0) //If there is a description
			{
				menu.html.descriptions[index] = desc[0];
				menu.descriptions = true;
				//Unless the index === 0 which would mean it's the default selected menu item, hide the description
				if (index !== 0)
				{
					$(desc[0]).addClass("menu-item-description-hidden");
				}
			}
			else
			{
				menu.html.descriptions[index] = $("<div class=\"menu-item-description\"></div>");
			}
		});
		$(menu.html.items[0]).addClass("menu-item-selected"); //Have the first menu item selected by default
		//Create the item container and description container
		var itemCont = document.createElement('div'); //Create the item container
		$(itemCont).addClass("menu-item-container").appendTo(menuElement); //Add the item container class and append it to the meny element
		$(menu.html.items).appendTo(itemCont); //Append the menu items to the item container
		if (menu.descriptions) //If at least one of the menu items has a description
		{
			var descCont = document.createElement('div'); //Create the description container
			$(descCont).addClass("menu-item-description-container").appendTo(menuElement); //Add the description container class and append it to the meny element
			$(menu.html.descriptions).appendTo(descCont); //Append the menu items to the description container
		}
		global_menus.menus.push(menu); //Add the menu to the global_menus array of menus
		//If the "open-with" attribute is set on the html element, add it to the "toggleKeyCodes" array.
		if ($(menuElement).is("[open-with]"))//If the menu has the "open-with" attribute set
		{
			var openWith = $(menuElement).attr("open-with");//Get the keycode
			openWith = Number(openWith); //Conver it to a number
			if (openWith !== 27)
				global_menus.toggleKeyCodes.push(openWith);
		}
		else
		{
			global_menus.toggleKeyCodes.push(false);
		}
	});
	//Create the "menu container" DOM element and add all the menus to it
	$("<div id=\"menu-container\"></div>").appendTo(document.body);
	$(menuElements).appendTo("#menu-container");
	//Add the enter key event listener
	$(document).keydown(function(e){
		if (e.which === 13) //If it's the enter key
		{
			//Active the "on enter" function for the open menu, if there is one. 
			if (global_menus.openMenu)
			{
				global_menus.openMenu.onEnter();
			}
		}
		//If a key pressed toggles a menu
		if (global_menus.toggleKeyCodes.indexOf(e.which) !== -1)
		{
			var index = global_menus.toggleKeyCodes.indexOf(e.which);
			var menuToToggle = global_menus.menus[index];
			global_menus.toggle(menuToToggle.html.menu.id);
		}
		if (e.which === 27) //If it's the escape key
			global_menus.close();
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




















