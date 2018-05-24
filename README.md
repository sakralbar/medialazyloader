# mediaLazyLoader.js (Simple lazy loader with support for tags img, picture, video, iframe and background images)

mediaLazyLoader.js is a small lazy loading script for `<img>`, `<picture>`, `<video>` and `<iframe>` elements with background images support.

## Usage

First, connect the script to your project:

```html
<script src="mediaLazyLoader.min.js"></script>
```

You should add a class 'lazy' to all the elements that should use lazy loading:

```html
<img class="lazy" src="img/image.jpg">

<picture>
    <source srcset="img/image.webp">
    <source srcset="img/image.png">
    <img class="lazy" src="img/image.png" alt="">
</picture>

<video class="lazy" controls="" preload="none">
    <source src="bg.webm" type="video/webm">
</video>

<iframe class="lazy" src="https://www.youtube.com/embed/uHMm7-Zc404?rel=0&amp;showinfo=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
```