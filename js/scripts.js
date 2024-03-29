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
    categoryList.forEach(function(categoryElement) {
        let categoryElementName = categoryElement.getAttribute('name').toLowerCase();
        if (categoryElementName == categoryName) {
            modifySelectedCategoryElement(categoryElement);
        }
        else {
            modifyUnselectedCategoryElement(categoryElement);
        }
    });
}

function showAllProject() {
    projectCardList.forEach(function(card) {
        card.parentNode.classList.remove('d-none');
    });
}

function showCategoryProject(categoryName) {
    projectCardList.forEach(function(card) {
        if (card.getAttribute('category').includes(categoryName)) {
            card.parentNode.classList.remove('d-none');
        }
        else {
            card.parentNode.classList.add('d-none');
        }
    });
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
    let video = document.getElementById(videoName);
    let playButton = document.getElementById('pb-' + videoName);
    video.play();
    videoPlayList[videoName] = true;
    playButton.innerHTML = "";
}
function pauseVideo(videoName) {
    let video = document.getElementById(videoName);
    let playButton = document.getElementById('pb-' + videoName);
    video.pause();
    videoPlayList[videoName] = false;
    playButton.innerHTML = "<i class='fa fa-play'></i>";
}

function playSingleVideo(videoName) {
    for (let video in videoPlayList) {
        let isCurrentVideo = video == videoName;
        if (isCurrentVideo) {
            // if video is playing pause it
            if (videoPlayList[video]) {
                pauseVideo(video);
            }
            else {
                playVideo(video);
            }
        }
        else {
            pauseVideo(video);
        }
    }
}

function getCardPageIcon(pageAddress) {
    const pageTypeMap = new Map([
        ['github.com',   `<i class="fab fa-fw fa-github me-1"></i>github`],
        ['github.io',    `<i class="fab fa-fw fa-github me-1"></i>github`],
        ['itch.io',		 `<i class="fas fa-fw fa-gamepad me-1"></i>itch.io`],
        ['youtube.com',  `<i class="fab fa-fw fa-youtube me-1"></i>youtube`],
        ['youtu.be', 	 `<i class="fab fa-fw fa-youtube me-1"></i>youtube`],
        ['linkedin.com', `<i class="fab fa-fw fa-linkedin me-1"></i>linkedin`],
        ['medium.com',   `<i class="fab fa-fw fa-medium me-1"></i>medium`],
    ]);

    let pageHostAddress = new URL(pageAddress).host
    for (const [key, value] of pageTypeMap)
        if (pageHostAddress.includes(key))
          return value;
  	
  	// default icon
    return `<i class="fas fa-fw fa-link me-1"></i>link`;
}

function isSourceVideo(src) {
    return src.includes(".mp4")
}

function createCardTagHtml(project) {
    // sort tags by alphabetic
    // project.tags.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    
    let tagListHtml = '';
    project.tags.forEach(tag => {
        tagListHtml += `<mark>${tag}</mark> `;
    });
    return tagListHtml;
}

function createCardImageHtml(project) {
    let imageSourceHtml = '';
    let imageSrc = project.image.src;

    // video source
    if (isSourceVideo(imageSrc)) {
        let projectVideoName = imageSrc.substring(
            imageSrc.lastIndexOf("/") + 1,
            imageSrc.lastIndexOf("."));
        projectPosterSrc = imageSrc.replace(".mp4", ".png");
        imageSourceHtml = `
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
        imageSourceHtml = `
    <img class="card-img-top" src="${imageSrc}" alt="${project.title}">
        `;
    }

    return imageSourceHtml;
}

function createCardHtml(project) {
    // card image or video
    let imageSource = createCardImageHtml(project);

    // card bottom address page & icon
    let pageIcon = getCardPageIcon(project.page.href);

    // card tag list
    let tagElementList = createCardTagHtml(project);

    // project card html
    let projectCardHtmlText = `
<!-- Portfolio Card: ${project.id} -->
<div class="col-md-6 col-lg-4 mb-5 d-flex align-items-stretch">
    <div class="card card-container" category="${project.category}">
        ${imageSource}
        <div class="card-body">
            <h5 class="card-title"> <a class="card-page" href="${project.page.href}" target="${project.page.target}">
                ${project.title}
            </a></h5>
            <p class="card-text text-secondary">${project.text}</p>
            <div class="card-tag mb-3" title="Card: ${project.id}">
                ${tagElementList}
            </div>
            <a class="card-page" href="${project.page.href}" target="${project.page.target}">
                <div class="pt-4 w-100">
                    <p class="card-muted position-absolute bottom-0 pb-3">
                        <small class="text-muted">${pageIcon}</small>
                    </p>
                </div>
            </a>
        </div>
    </div>
</div>
    `;

    return projectCardHtmlText;
}

function initPortfolioSection() {
    // initialize category tabs
    initCategoryTab();

    // Parent element
    const portfolioSection = document.getElementById('portfolio-items');

    // Load the portfolio items from the JSON file
    fetch('/data/projects.json')
        .then(response => response.json())
        .then(projects => {
            // Sort card items by id list
            // let idsToSortBy = [22, 21, 19, 18, 17, 20, 16, 15, 14, 13, 12, 11, 10];
            // projects.sort((a, b) => idsToSortBy.indexOf(a.id) - idsToSortBy.indexOf(b.id));
            projects.forEach(project => {
                let projectCardHtml = createCardHtml(project);
                portfolioSection.insertAdjacentHTML('beforeend', projectCardHtml);
            });

            // get all card elements for categorize
            projectCardList = document.querySelectorAll(".card-container");
        })
        .catch(error => console.error(error));
}