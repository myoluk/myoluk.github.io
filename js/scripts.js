var cardElements;
var tabElements;
var videoNames = {};

window.addEventListener('DOMContentLoaded', event => {
    loadProjects();
    initTabElements();
    initMarkdown();

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

function initMarkdown(){
    var elements = document.querySelectorAll('.markdown');
    for (let i = 0; i < elements.length; i++){
        var elementText = elements[i].textContent;
        var md = new markdownit();
        var markdownText = md.render(elementText);
        elements[i].innerHTML = markdownText;
    }
}

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

function playVideo(videoName){
    var video = document.getElementById(videoName);
    var playButton = document.getElementById('pb-' + videoName);
    video.play();
    playButton.innerHTML = "";
}
function pauseVideo(videoName){
    var video = document.getElementById(videoName);
    var playButton = document.getElementById('pb-' + videoName);
    video.pause();
    playButton.innerHTML = "<i class='fa fa-play'></i>";
}

function playPauseVideo(videoName){
    for (let video in videoNames){
        // if video name matchs
        if (video == videoName){
            // if video is playing pause it
            if (videoNames[video]){
                pauseVideo(video);
                videoNames[video] = false;
            }
            // if video is not playing play it
            else {
                playVideo(video);
                videoNames[video] = true;
            }
        }
        // if video name not match
        else {
            pauseVideo(video);
            videoNames[video] = false;
        }
    }
}

function loadProjects(){
    // Parent element
    const portfolioItems = document.getElementById('portfolio-items');

    // Load the portfolio items from the JSON file
    fetch('/data/projects-data.json')
        .then(response => response.json())
        .then(projects => {
            
            // Sort card items by id list
            let idsToSortBy = [12, 9, 8, 7, 10, 6, 5, 11, 4, 3, 2, 1];
            projects.sort((a, b) => idsToSortBy.indexOf(a.id) - idsToSortBy.indexOf(b.id));

            // Loop through each project and create a project card
            projects.forEach(project => {
                // sort tags by alphabetic
                // project.tags.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

                // video source
                let projectImageSource = '';
                if (project.image.src.includes(".mp4")){
                    let projectVideoName = project.image.src.substring(
                        project.image.src.lastIndexOf("/") + 1,
                        project.image.src.lastIndexOf("."));
                    projectPosterSrc = project.image.src.replace(".mp4", ".png");
                    projectImageSource = `
        <video id="${projectVideoName}" class="card-img-top" width="100%" poster="${projectPosterSrc}" onclick="playPauseVideo('${projectVideoName}')" loop>
            <source src="${project.image.src}" type="video/mp4">
            ${project.image.alt}
        </video>
        <div id="pb-${projectVideoName}" class="play-button"><i class="fa fa-play"></i></div>
                    `;

                    videoNames[projectVideoName] = false;
                }
    
                // image source
                else {
                    projectImageSource = `
        <img class="card-img-top" src="${project.image.src}" alt="${project.image.alt}">            
                    `;
                }

                let tagElements = '';
                project.tags.forEach(tag => {
                    tagElements += `<mark>${tag}</mark> `;
                });

                let projectPageIcon = '';
                if (project.page.href.includes('github.com')){
                    projectPageIcon = `<i class="fab fa-github fa-fw me-1"></i>github`;
                }
                else if (project.page.href.includes('itch.io')){
                    projectPageIcon = `<i class="fas fa-fw fa-gamepad me-1"></i>itch.io`;
                }
                else if (project.page.href.includes('youtube.com') || project.page.href.includes('youtu.be')){
                    projectPageIcon = `<i class="fab fa-youtube fa-fw me-1"></i>github`;
                }
                else {
                    projectPageIcon = `<i class="fas fa-fw fa-link me-1"></i>itch.io`;
                }

                const projectCard = `
<!-- Portfolio Item id:${project.id} -->
<div class="col-md-6 col-lg-4 mb-5 d-flex align-items-stretch">
    <div class="card card-container" category="${project.category}">
        ${projectImageSource}
        <div class="card-body">
            <h5 class="card-title"> <a class="card-page" href="${project.page.href}" target="${project.page.target}">
                ${project.title}
            </a></h5>
            <p class="card-text text-secondary">${project.text}</p>
            <div class="card-tag mb-3" title="Card: ${project.id}">
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