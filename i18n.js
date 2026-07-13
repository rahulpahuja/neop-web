// Shared EN/FR language-toggle logic for the NEOP demo pages.
// Each page defines window.NEOP_TRANSLATIONS = { en: {...}, fr: {...} }
// before this script runs, then tags translatable elements with:
//   data-i18n="key"              -> sets textContent
//   data-i18n-placeholder="key"  -> sets the placeholder attribute
//   data-i18n-title="key"        -> sets the title attribute
const NEOP_LANG_KEY = 'neop_lang';

function neopGetLang() {
    return localStorage.getItem(NEOP_LANG_KEY) || 'en';
}

function neopApplyLanguage(lang) {
    const dict = (window.NEOP_TRANSLATIONS && window.NEOP_TRANSLATIONS[lang]) || {};
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach((el) => {
        const value = dict[el.getAttribute('data-i18n')];
        if (value !== undefined) el.textContent = value;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
        const value = dict[el.getAttribute('data-i18n-placeholder')];
        if (value !== undefined) el.setAttribute('placeholder', value);
    });
    document.querySelectorAll('[data-i18n-title]').forEach((el) => {
        const value = dict[el.getAttribute('data-i18n-title')];
        if (value !== undefined) el.setAttribute('title', value);
    });

    document.querySelectorAll('[data-neop-lang-code]').forEach((el) => {
        el.textContent = lang.toUpperCase();
    });
    document.querySelectorAll('[data-neop-lang-toggle]').forEach((el) => {
        el.setAttribute('aria-label', lang === 'en' ? 'Switch to French' : 'Passer en anglais');
        el.setAttribute('title', lang === 'en' ? 'Switch to French' : 'Passer en anglais');
    });

    localStorage.setItem(NEOP_LANG_KEY, lang);
}

function neopToggleLanguage() {
    neopApplyLanguage(neopGetLang() === 'en' ? 'fr' : 'en');
}

document.addEventListener('DOMContentLoaded', () => {
    neopApplyLanguage(neopGetLang());
    document.querySelectorAll('[data-neop-lang-toggle]').forEach((btn) => {
        btn.addEventListener('click', neopToggleLanguage);
    });
});
