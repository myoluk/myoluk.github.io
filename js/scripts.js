var cardElements;
var tabElements;

window.addEventListener('DOMContentLoaded', event => {
    cardElements = document.querySelectorAll("#portfolio [category]");
    initTabElements();

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

function initTabElements(){
    tabElements = document.querySelectorAll(".tab-category");
    tabElements[0].style.textDecoration = 'none';
    tabElements[0].style.color = '#2C3E50';
}

function modifySelected(category) {
    for (let i=0; i<tabElements.length; i++){
        let tabElement = tabElements[i];
        if (tabElement.getAttribute('name').toLowerCase() == category){
            tabElement.style.textDecoration = 'none';
            tabElement.style.color = '#2C3E50';
        }
        else {
            tabElement.style.textDecoration = 'underline';
            tabElement.style.color = '#1abc9c';
        }
    }
}

function showCategory(category) {
    category = category.toLowerCase();
    modifySelected(category);
    if (category == 'all'){
        showCategoryAll();
        return;
    }
    for(let i=0; i<cardElements.length; i++){
        if (cardElements[i].getAttribute('category').includes(category)){
            cardElements[i].parentNode.classList.remove('d-none');
        }
        else {
            cardElements[i].parentNode.classList.add('d-none');
        }
    }
}

function showCategoryAll() {
    for(let i=0; i<cardElements.length; i++){
        cardElements[i].parentNode.classList.remove('d-none');
    }
}
