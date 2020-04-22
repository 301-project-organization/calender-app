console.log("menu");

$(document).ready(function(){
    console.log("hello");
    /*  hide-show mobile menu  */
    $("#menu_icon").click(function(){
        $("#nav_menu").toggleClass("show_menu");
        return false;
    });
});


