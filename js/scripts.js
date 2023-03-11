var cardElements;
var tabElements;

window.addEventListener('DOMContentLoaded', event => {
    loadProjects();
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

function loadProjects(){
    // Parent element
    const portfolioItems = document.getElementById('portfolio-items');

    // Load the portfolio items from the JSON file
    fetch('/data/projects-data.json')
        .then(response => response.json())
        .then(projects => {
            
            // Loop through each project and create a project card
            projects.forEach(project => {
                let tagElements = '';
                project.tags.forEach(tag => {
                    tagElements += `<mark>${tag}</mark> `;
                });

                let projectPageIcon = '';
                if (project.page.href.includes('github')){
                    projectPageIcon = `<i class="fab fa-github fa-fw me-1"></i>github`;
                }
                else if (project.page.href.includes('itch.io')){
                    projectPageIcon = `<i class="fas fa-fw fa-gamepad me-1"></i>itch.io`;
                }

                const projectCard = `
<!-- Portfolio Item id:${project.id} -->
<div class="col-md-6 col-lg-4 mb-5 d-flex align-items-stretch">
    <div class="card text-lowercase card-container" category="${project.category}">
        <img class="card-img-top" src="${project.image.src}" alt="${project.image.alt}">
        <div class="card-body">
            <h5 class="card-title">${project.title}</h5>
            <p class="card-text">${project.text}</p>
            <div class="card-tag mb-3">
                ${tagElements}
            </div>
            <a class="card-page" href="${project.page.href}" target="${project.page.target}">
                <div class="pt-4 w-100">
                    <p class="card-muted position-absolute bottom-0 pb-3">
                        <small class="text-muted">${projectPageIcon}</small>
                    </p>
                </div>
            </a>
        </div>
    </div>
</div>
                `;
                // Append the card to the portfolio deck
                portfolioItems.insertAdjacentHTML('beforeend', projectCard);

                // get all card elements
                cardElements = document.querySelectorAll(".card-container");
            });
        })
        .catch(error => console.error(error));
}