/**
 * MediaLazyLoader.js version 1.1.0
 * Custom lazy loader for Zdorov company
 **/

(function () {

    //change data-attributes for tags
    function changeAttributes(elem) {
        for (var dataAttribute in elem.dataset) {
            elem.setAttribute(dataAttribute, elem.dataset[dataAttribute]);
            elem.removeAttribute('data-${dataAttribute}');
        }
    }

    //change data-attributes for <source> elements
    function changeSourcesAttributes(elem) {
        [].slice.call(elem.querySelectorAll("source")).forEach(source => {
            changeAttributes(source);
        });
        changeAttributes(elem.querySelector('img'));
    }

    //add class onload
    function addClassOnload(elem) {

        if (elem.hasAttribute('src')) {
            elem.onload = function () {
                elem.classList.add("lazy_loaded");
            };
        } else {
            elem.classList.add("lazy_loaded");
        }
    }

    //main function to service lazy elements
    function tagHandling(elem) {

        // Список тегов без фонового изображения
        let tagNames = ['IMG', 'IFRAME', 'VIDEO'];
        // Проверяем, нужно ли загружать фоновое изображение
        let isBackground = (tagNames.includes(elem.tagName)) ? false : true;

        // Если это не фоновое изображение
        if (!isBackground) {

            // Если нет прокрутки страницы
            if (!document.body.classList.contains('scrolling')) {

                switch (elem.tagName) {
                    case 'IMG':
                        let parentElement = elem.parentNode;

                        if (parentElement.tagName === "PICTURE") {
                            changeSourcesAttributes(parentElement);
                        } else {
                            changeAttributes(elem);
                        }
                        break;

                    case 'IFRAME':
                        changeAttributes(elem);
                        break;

                    case 'VIDEO':
                        changeSourcesAttributes(elem);
                        elem.load();
                        break;

                    default:
                        break;
                }

                addClassOnload(elem);
            }

        } else {

            addClassOnload(elem);
        }
    }

    function lazyObserver(lazyTags) {

        let options = {
            rootMargin: '400px 0px 400px 0px',
            threshold: [0, 0.25, 0.5, 0.75, 1]
        }

        let lazyCallback = function (entries, observer) {
            entries.forEach(function (entry) {

                if (entry.isIntersecting) {
                    let lazyTag = entry.target;

                    tagHandling(lazyTag);

                    // Не исключаем элемент из наблюдения при прокрутке страницы
                    if (!document.body.classList.contains('scrolling')) {
                        lazyTagsObserver.unobserve(lazyTag);
                    }
                }

            });
        }

        let lazyTagsObserver = new IntersectionObserver(lazyCallback, options);

        lazyTags.forEach(function (lazyTag) {
            lazyTagsObserver.observe(lazyTag);
        });
    }

    function lazyObserverFallback(lazyTags) {
        let active = false;

        const lazyLoad = function () {
            if (active === false) {
                active = true;

                setTimeout(function () {
                    lazyTags.forEach(function (lazyTag) {
                        if ((lazyTag.getBoundingClientRect().top - 400 <= window.innerHeight && lazyTag.getBoundingClientRect().bottom + 400 >= 0) && getComputedStyle(lazyTag).display !== "none") {

                            tagHandling(lazyTag);

                            if (lazyTags.length === 0 && !document.querySelector('body').classList.contains('scrolling')) {
                                document.removeEventListener("scroll", lazyLoad);
                                window.removeEventListener("resize", lazyLoad);
                                window.removeEventListener("orientationchange", lazyLoad);
                            }
                        }
                    });

                    active = false;
                }, 200);
            }
        };

        document.addEventListener("scroll", lazyLoad);
        window.addEventListener("resize", lazyLoad);
        window.addEventListener("orientationchange", lazyLoad);

        lazyLoad();
    }

    document.addEventListener("DOMContentLoaded", function () {

        // Теги для ленивой загрузки
        var lazyTags = [].slice.call(document.querySelectorAll(".lazy"));

        // выбираем целевой элемент
        var target = document.querySelector('body');

        // создаём экземпляр MutationObserver
        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {

                // Если класс scrolling был удалён
                if (mutation.oldValue.indexOf('scrolling') != -1) {

                    if ("IntersectionObserver" in window) {
                        lazyObserver(lazyTags);
                    } else {
                        // для старых браузеров
                        lazyObserverFallback(lazyTags);
                    }
                }
            });
        });

        // конфигурация нашего observer:
        var config = { attributes: true, childList: false, characterData: false, attributeOldValue: true, attributeFilter: ['class'] };

        // передаём в качестве аргументов целевой элемент и его конфигурацию
        observer.observe(target, config);

        if ("IntersectionObserver" in window) {
            lazyObserver(lazyTags);
        } else {
            console.log('no IntersectionObserver support');
            lazyObserverFallback(lazyTags);
        }
    });

})();
