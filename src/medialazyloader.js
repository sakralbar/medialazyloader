/**
 * MediaLazyLoader.js version 1.0.1
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
        if (elem.tagName === "IMG") {
            let parentElement = elem.parentNode;

            if (parentElement.tagName === "PICTURE") {
                changeSourcesAttributes(parentElement);
            } else {
                changeAttributes(elem);
            }

        } else if (elem.tagName === "IFRAME") {
            changeAttributes(elem);

        } else if (elem.tagName === "VIDEO") {
            changeSourcesAttributes(elem);
            elem.load();
        }
        
        addClassOnload(elem);
    }

    document.addEventListener("DOMContentLoaded", function () {

        var lazyTags = [].slice.call(document.querySelectorAll(".lazy"));

        if ("IntersectionObserver" in window) {
            let lazyTagsObserver = new IntersectionObserver(function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        let lazyTag = entry.target;

                        tagHandling(lazyTag);
                        lazyTagsObserver.unobserve(lazyTag);
                    }
                });
            },
                    {rootMargin: "0px 0px 400px 0px"}
            );

            lazyTags.forEach(function (lazyTag) {
                lazyTagsObserver.observe(lazyTag);
            });

        } else {

            console.log('no IntersectionObserver support');

            let active = false;

            const lazyLoad = function () {
                if (active === false) {
                    active = true;

                    setTimeout(function () {
                        lazyTags.forEach(function (lazyTag) {
                            if ((lazyTag.getBoundingClientRect().top - 400 <= window.innerHeight && lazyTag.getBoundingClientRect().bottom >= 0) && getComputedStyle(lazyTag).display !== "none") {

                                tagHandling(lazyTag);

                                if (lazyTags.length === 0) {
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
    });

})();