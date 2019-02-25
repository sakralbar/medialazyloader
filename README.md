# mediaLazyLoader.js (Simple lazy loader)

mediaLazyLoader.js is a small lazy loading script for `<img>`, `<picture>`, `<video>` and `<iframe>` elements with background images support.

## Usage

First, connect the script to your project:

```html
<script src="mediaLazyLoader.min.js"></script>
```

Than add a class "lazy" to all the elements that should use lazy loading:

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

<iframe class="lazy" src="https://www.youtube.com/embed/dfIHfdg?rel=0&amp;showinfo=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
```
Now replace all the "src" attributes with the "data-src" and add your placeholder or lowres images to "src" like:

```html
<img class="lazy" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" data-src="img/image.jpg">
```

In this case, I used the image code of the gif format is one pixel in size.

## Background images
You can add a class "lazy" to any element that has a background image. After the element appears in the viewport, class "lazy_loaded" is added to class "lazy". You can use this as follows:

```css
.block{
    background-image: url(../img/placeholder.png);
}

.block.lazy_loaded{
    background-image: url(../img/full-bg.jpg);
}
```
When an element is loaded, a "loaded" event fires.