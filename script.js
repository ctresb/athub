fetch("content.json")
.then(function(response) {
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
})
.then(function(data) {
  var categories = data.categories;
  var projects = data.projects;
  var categoriesContainer = document.querySelector(".categories-container");
  var itemsContainer = document.querySelector(".category-items");
  var searchBar = document.querySelector(".search-bar");
  var selectedCategoryIndex = 0;
  var currentSearchTerm = "";

  function createCategoryTabs() {
    categoriesContainer.innerHTML = "";
    categories.forEach(function(categoryName, categoryIndex) {
      var categoryTab = document.createElement("div");
      categoryTab.classList.add("category-tab");
      var categoryParagraph = document.createElement("p");
      categoryParagraph.textContent = categoryName;
      categoryTab.appendChild(categoryParagraph);
      categoryTab.addEventListener("click", function() {
        selectedCategoryIndex = categoryIndex;
        currentSearchTerm = "";
        var allTabs = document.querySelectorAll(".category-tab");
        allTabs.forEach(function(tab) {
          tab.classList.remove("selected");
        });
        categoryTab.classList.add("selected");
        filterAndRenderProjects();
      });
      if (categoryIndex === selectedCategoryIndex) {
        categoryTab.classList.add("selected");
      }
      categoriesContainer.appendChild(categoryTab);
    });
  }

  function filterAndRenderProjects() {
    itemsContainer.innerHTML = "";
    var filteredProjects;
    if (currentSearchTerm !== "") {
      filteredProjects = projects.filter(function(project) {
        var lowerCaseTerm = currentSearchTerm.toLowerCase();
        var titleMatch = project.title.toLowerCase().includes(lowerCaseTerm);
        var descriptionMatch = project.description.toLowerCase().includes(lowerCaseTerm);
        var authorMatch = project.author.toLowerCase().includes(lowerCaseTerm);
        var tagsMatch = false;
        if (Array.isArray(project.tags)) {
          tagsMatch = project.tags.some(function(tag) {
            return tag.toLowerCase().includes(lowerCaseTerm);
          });
        }
        return titleMatch || descriptionMatch || authorMatch || tagsMatch;
      });
    } else {
      filteredProjects = projects.filter(function(project) {
        return project.categories.includes(selectedCategoryIndex);
      });
    }
    filteredProjects.forEach(function(project) {
      var projectLink = document.createElement("a");
      projectLink.href = project.link || "#";
      projectLink.target = "_blank";
      var projectItem = document.createElement("div");
      projectItem.classList.add("category-item");
      var projectImage = document.createElement("img");
      projectImage.classList.add("item-image");
      projectImage.src = project.image || "./placeholder.png";
      projectImage.alt = project.title || "Project image";
      projectItem.appendChild(projectImage);
      var projectContent = document.createElement("div");
      projectContent.classList.add("item-content");
      var projectTitleElement = document.createElement("p");
      projectTitleElement.classList.add("item-title");
      projectTitleElement.textContent = project.title || "Untitled";
      projectContent.appendChild(projectTitleElement);
      var projectDescriptionElement = document.createElement("p");
      projectDescriptionElement.classList.add("item-description");
      projectDescriptionElement.textContent = project.description || "No description provided.";
      projectContent.appendChild(projectDescriptionElement);
      var projectAuthorElement = document.createElement("p");
      projectAuthorElement.classList.add("item-author");
      projectAuthorElement.textContent = "Author: " + (project.author || "Unknown");
      projectContent.appendChild(projectAuthorElement);
      var projectHashtagsContainer = document.createElement("p");
      projectHashtagsContainer.classList.add("hashtags");
      if (Array.isArray(project.tags)) {
        project.tags.forEach(function(tag) {
          var projectTagElement = document.createElement("span");
          projectTagElement.classList.add("item-tag");
          projectTagElement.textContent = "#" + tag;
          projectHashtagsContainer.appendChild(projectTagElement);
        });
      }
      projectContent.appendChild(projectHashtagsContainer);
      projectItem.appendChild(projectContent);
      projectLink.appendChild(projectItem);
      itemsContainer.appendChild(projectLink);
    });
  }

    searchBar.addEventListener("input", function() {
        currentSearchTerm = searchBar.value;
        filterAndRenderProjects();
    });


  createCategoryTabs();
  filterAndRenderProjects();
})
.catch(function(error) {
  console.error("Error fetching content.json:", error);
});