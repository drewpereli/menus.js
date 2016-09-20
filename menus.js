
function Menu()
{
	this.parentMenu = false;
	this.childMenu = false;

	this.show;
	this.hide;
	this.selectDown;
	this.selectUp;

	this.html = 
	{
		menu: false,
		items: [],
	}
}


$(document).ready(function(){
	var importedNames = ["Menu"];
	$(importedNames).each(function(index, name){
		var imported = document.createElement("script");
		imported.src = name + ".js";
		document.head.appendChild(imported);
	});
	global_menus.initialize();
});

////////////////////////

var global_menus = {};
global_menus.menus = [];
global_menus.initialize = function()
{
	//Add the 'menu-hide' and 'menu-show' style rules
	$("<style type=\"text/css\">.menu-hide{display: none;}</style>").appendTo(document.head);
	var menuElements = $(".menu");
	$(menuElements).each(function(index, menuElement){
		$(menuElement).addClass("menu-hide");
		var menu = new Menu();
		menu.html.menu = menuElement;
		menu.html.items = $(menuElement).children(".menu-item");
		global_menus.menus.push(menu);
	});

}




