function updateActivePage() {
    var currentPage = window.location.pathname;
    var navigationBar = document.getElementById("navigationBar");
    var ul = navigationBar.getElementsByTagName("li");
    for (let index = 0; index < ul.length; index++) {
        var li = ul[index];
        var a = li.getElementsByTagName("a")[0];
        if (a.pathname == currentPage) {
            li.classList.add("active");
            preventRedirect(a.id);
        }
    }
}

function preventRedirect(id) {
    document.addEventListener('click', function(event) {
        if (event.target.id == id) {
            event.preventDefault();
        }
    });
}