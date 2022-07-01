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
            changeLocale(possibleLocale.toLowerCase());
            return;
        }
    }
    changeLocale(DEFAULT_LOCALE);
}

function changeLocale(newLocale) {
    if (newLocale == localStorage.getItem('locale')) {
        return;
    }
    localStorage.setItem('locale', newLocale);
    updateLocale();
}

function updateLocale() {
    let currentLocale = localStorage.getItem('locale');
    if (currentLocale == null) {
        throw 'Null locale';
    }
    console.log("Update locale: ".concat(localStorage.getItem('locale')));
}

function showLocaleSelector() {
    document.getElementById("language-menu").classList.toggle("show");
}