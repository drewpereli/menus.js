
function Menu()
{
	this.parentMenu = false;
	this.childMenu = false;
	this.open = false; //true only if it's the current menu being looked at
	this.descriptions = false; //True only if at least one menu item comes with a description
	this.html = 
	{
		menu: false,
		items: [],
		descriptions: [],
	}
}


function DynamicMenu(itemArray)
{
	this.itemArray = itemArray;

	this.initialize();
}

DynamicMenu.prototype = new Menu;

DynamicMenu.prototype.initialize = function()
{
	console.log("it's working");
}

var array = ["a"];
var m = new DynamicMenu(array);


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
	openMenu: false
};
global_menus.menus = [];

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
		global_menus.menus.push(menu); //Add the menu to the global_menus array of menus
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
		//Do the title stuff, if there is a title
		/*
		var title = menuElement.children(".menu-title");
		if (title.length >= 0)
		{
			title = title[0];

		}
		*/
	});
	//Create the "menu container" DOM element and add all the menus to it
	$("<div id=\"menu-container\"></div>").appendTo(document.body);
	$(menuElements).appendTo("#menu-container");
}


//Opens or closes the menu
global_menus.toggle = function(menuId)
{
	if ($("#" + menuId).hasClass("menu-hide"))
		this.open(menuId);
	else if ($("#" + menuId).hasClass("menu-show"))
		this.close();
	else
		console.log("Menu of id " + menuId + " has neither the menu-hide nor menu-show class");
}

global_menus.open = function(menuId)
{
	//Hide the currently shown menu, if there is one.
	$(".menu-show").removeClass("menu-show").addClass("menu-hide");
	var menuToShow = $("#" + menuId);
	$(menuToShow).removeClass("menu-hide").addClass("menu-show");
	this.openMenu = this.getMenuFromId(menuId);
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




















