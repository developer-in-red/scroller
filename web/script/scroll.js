import { addChunkToUI } from "./grid.js";

var scrollDirection = 5;
var scrollInterval;
var scrollSpeed = 10;
function pageScroll() {
  window.scrollBy(0, scrollDirection);
}

function enableScroll() {
  if (scrollInterval) clearInterval(scrollInterval);
  scrollInterval = setInterval(pageScroll, scrollSpeed);
}

function onSpeedChange(value) {
  scrollDirection = value;
  enableScroll();
  document.querySelector(
    '.toolbar output[for="autoscroll"]'
  ).innerHTML = scrollDirection;
}

export function startScrollListener() {
  window.onSpeedChange = onSpeedChange;
  window.onscroll = function (ev) {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      addChunkToUI();
    }
  };
}
