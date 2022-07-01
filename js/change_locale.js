let DEFAULT_LOCALE = "en-us";
let SUPPORTED_LOCALES = ["en-us", "it-it"]

function initializeLocale() {
    if (localStorage.getItem('locale') != null) {
        updateLocale();
        return;
    }
    let possibleLocales = navigator.languages;
    for (let index = 0; index < possibleLocales.length; index++) {
        const possibleLocale = possibleLocales[index];
        if (SUPPORTED_LOCALES.includes(possibleLocale.toLowerCase())) {
            localStorage.setItem('locale', possibleLocale);
            updateLocale();
            return;
        }
    }
    localStorage.setItem('locale', DEFAULT_LOCALE);
}

function changeLocale(newLocale) {
    showLocaleSelector();
    if (newLocale == localStorage.getItem('locale')) {
        return;
    }
    localStorage.setItem('locale', newLocale);
    updateLocale();
}

function updateLocale() {
    showActiveLocale();
    let currentLocale = localStorage.getItem('locale');
    if (currentLocale == null) {
        throw 'Null locale';
    }
    console.log("Update locale: ".concat(localStorage.getItem('locale')));
}

function showLocaleSelector() {
    document.getElementById("language-menu").classList.toggle("show");
    document.getElementById("shadow-menu").classList.toggle("show");
}

function showActiveLocale() {
    let ul = document.getElementById("language-menu");
    let locales = ul.getElementsByTagName("a");
    for (let index = 0; index < locales.length; index++) {
        const locale = locales[index];
        locale.classList.remove("active");
        if(locale.id == localStorage.getItem('locale')) {
            locale.classList.add("active");
        }
    }
}