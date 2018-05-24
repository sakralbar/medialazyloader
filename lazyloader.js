/**
 * MediaLazyLoader.js version 0.1
 * Custom lazy loader for Zdorov company
 **/

(function () {

    function changeAttributes(elem) {
        for (let dataAttribute in elem.dataset) {
            elem.setAttribute(dataAttribute, elem.dataset[dataAttribute]);
            elem.removeAttribute(`data-${dataAttribute}`);
        }
    }

    function changeSourcesAttributes(elem) {
        [].slice.call(elem.querySelectorAll("source")).forEach(source => {
            changeAttributes(source);
        });
    }

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
                        lazyTag.classList.add("lazy_loaded");

                    }
                });
            },
                    {rootMargin: "0px 0px 200px 0px"}
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
                            if ((lazyTag.getBoundingClientRect().top - 200 <= window.innerHeight && lazyTag.getBoundingClientRect().bottom >= 0) && getComputedStyle(lazyTag).display !== "none") {

                                if (lazyTag.tagName === "IMG") {
                                    let parentElement = lazyTag.parentNode;

                                    if (parentElement.tagName === "PICTURE") {
                                        changeSourcesAttributes(parentElement);
                                    } else {
                                        changeAttributes(lazyTag);
                                    }

                                } else if (lazyTag.tagName === "IFRAME") {
                                    changeAttributes(lazyTag);

                                } else if (lazyTag.tagName === "VIDEO") {
                                    changeSourcesAttributes(lazyTag);
                                    lazyTag.load();
                                }

                                lazyTags = lazyTags.filter(function (tag) {
                                    return tag !== lazyTag;
                                });

                                lazyTag.classList.add("lazy_loaded");

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