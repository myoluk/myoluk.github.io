var projectCardList;
var categoryList;
var videoPlayList = {};

// load projects cards
initPortfolioSection();

window.addEventListener('DOMContentLoaded', event => {
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

function modifySelectedCategoryElement(categoryElement) {
    categoryElement.style.textDecoration = 'none';
    categoryElement.style.color = '#2C3E50';
}

function modifyUnselectedCategoryElement(categoryElement) {
    categoryElement.style.textDecoration = 'underline';
    categoryElement.style.color = '#1abc9c';
}

function highlightCategory(categoryName) {
    for (let i = 0; i < categoryList.length; i++) {
        let categoryElement = categoryList[i];
        if (categoryElement.getAttribute('name').toLowerCase() == categoryName) {
            modifySelectedCategoryElement(categoryElement);
        }
        else {
            modifyUnselectedCategoryElement(categoryElement);
        }
    }
}

function showAllProject() {
    for (let i = 0; i < projectCardList.length; i++) {
        projectCardList[i].parentNode.classList.remove('d-none');
    }
}

function showCategoryProject(categoryName) {
    for (let i = 0; i < projectCardList.length; i++) {
        let card = projectCardList[i];
        if (card.getAttribute('category').includes(categoryName)) {
            card.parentNode.classList.remove('d-none');
        }
        else {
            card.parentNode.classList.add('d-none');
        }
    }
}

function selectCategory(categoryName) {
    categoryName = categoryName.toLowerCase();
    highlightCategory(categoryName);
    if (categoryName == 'all') {
        showAllProject();
        return;
    }
    showCategoryProject(categoryName);
}

function initCategoryTab() {
    categoryList = document.querySelectorAll(".category");
    let firstCategoryElement = categoryList[0];
    modifySelectedCategoryElement(firstCategoryElement);
}

function playVideo(videoName) {
    var video = document.getElementById(videoName);
    var playButton = document.getElementById('pb-' + videoName);
    video.play();
    playButton.innerHTML = "";
}
function pauseVideo(videoName) {
    var video = document.getElementById(videoName);
    var playButton = document.getElementById('pb-' + videoName);
    video.pause();
    playButton.innerHTML = "<i class='fa fa-play'></i>";
}

function playSingleVideo(videoName) {
    for (let video in videoPlayList) {
        let isCurrentVideo = video == videoName;

        if (isCurrentVideo) {
            // if video is playing pause it
            if (videoPlayList[video]) {
                pauseVideo(video);
                videoPlayList[video] = false;
            }
            else {
                playVideo(video);
                videoPlayList[video] = true;
            }
        }
        else {
            pauseVideo(video);
            videoPlayList[video] = false;
        }
    }
}

function getCardPageIcon(pageAddress) {
    let projectPageIcon;

    if (pageAddress.includes('github.com')) {
        projectPageIcon = `<i class="fab fa-fw fa-github me-1"></i>github`;
    }
    else if (pageAddress.includes('itch.io')) {
        projectPageIcon = `<i class="fas fa-fw fa-gamepad me-1"></i>itch.io`;
    }
    else if (pageAddress.includes('youtube.com') || pageAddress.includes('youtu.be')) {
        projectPageIcon = `<i class="fab fa-fw fa-youtube me-1"></i>github`;
    }
    else if (pageAddress.includes('linkedin.com')) {
        projectPageIcon = `<i class="fab fa-fw fa-linkedin me-1"></i>linkedin`;
    }
    else if (pageAddress.includes('medium.com')) {
        projectPageIcon = `<i class="fab fa-fw fa-medium me-1"></i>linkedin`;
    }
    else {
        projectPageIcon = `<i class="fas fa-fw fa-link me-1"></i>link`;
    }

    return projectPageIcon;
}

function isSourceVideo(src) {
    return src.includes(".mp4")
}

function initPortfolioSection() {
    // initialize category tabs
    initCategoryTab();

    // Parent element
    const portfolioItems = document.getElementById('portfolio-items');

    // Load the portfolio items from the JSON file
    fetch('/data/projects.json')
        .then(response => response.json())
        .then(projects => {

            // Sort card items by id list
            // let idsToSortBy = [22, 21, 19, 18, 17, 20, 16, 15, 14, 13, 12, 11, 10];
            // projects.sort((a, b) => idsToSortBy.indexOf(a.id) - idsToSortBy.indexOf(b.id));

            // Loop through each project and create a project card
            projects.forEach(project => {
                // sort tags by alphabetic
                // project.tags.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

                // video source
                let projectImageSource = '';
                let imageSrc = project.image.src;
                if (isSourceVideo(imageSrc)) {
                    let projectVideoName = imageSrc.substring(
                        imageSrc.lastIndexOf("/") + 1,
                        imageSrc.lastIndexOf("."));
                    projectPosterSrc = imageSrc.replace(".mp4", ".png");
                    projectImageSource = `
        <video id="${projectVideoName}" class="card-img-top" width="100%" poster="${projectPosterSrc}" onclick="playSingleVideo('${projectVideoName}')" loop>
            <source src="${imageSrc}" type="video/mp4">
            ${project.image.alt}
        </video>
        <div id="pb-${projectVideoName}" class="play-button"><i class="fa fa-play"></i></div>
                    `;

                    videoPlayList[projectVideoName] = false;
                }

                // image source
                else {
                    projectImageSource = `
        <img class="card-img-top" src="${imageSrc}" alt="${project.title}">
                    `;
                }

                let tagElements = '';
                project.tags.forEach(tag => {
                    tagElements += `<mark>${tag}</mark> `;
                });

                // card bottom address page & icon
                let projectPageIcon = getCardPageIcon(project.page.href);

                const projectCard = `
<!-- Portfolio Card: ${project.id} -->
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
                projectCardList = document.querySelectorAll(".card-container");
            });
        })
        .catch(error => console.error(error));
}