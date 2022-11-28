

$.get('./layout/header.html' , data => $('#headerPlaceholder').replaceWith(data));
$.get('./layout/sidebar.html' , data => $('#sidebarPlaceholder').replaceWith(data));
$.get('./layout/navbar.html' , data => $('#navbarPlaceholder').replaceWith(data));
// $.get('./layout/content/dashboard.html' , data => $('#contentPlaceholder').replaceWith(data));
$.get('./layout/footer.html' , data => $('#footerPlaceholder').replaceWith(data));
$.get('./layout/scripts.html' , data => $('#scriptsPlaceholder').replaceWith(data));