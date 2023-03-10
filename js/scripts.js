var cardElements;

window.addEventListener('DOMContentLoaded', event => {
    cardElements = document.querySelectorAll("#portfolio [category]");

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 72,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});

function ShowCategory(category) {
    ShowCategoryAll();
    category = category.toLowerCase();
    for(let i=0; i<cardElements.length; i++){
        if (cardElements[i].getAttribute('category') == category){
            cardElements[i].parentNode.classList.remove('d-none');
        }
        else {
            cardElements[i].parentNode.classList.add('d-none');
        }
    }

}

function ShowCategoryAll() {
    for(let i=0; i<cardElements.length; i++){
        cardElements[i].parentNode.classList.remove('d-none');
    }
}
