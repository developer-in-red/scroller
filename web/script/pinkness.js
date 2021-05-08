function onPinkIntensityChange(value) {
  document.documentElement.style.setProperty("--pinkness-intensity", value);
  document.querySelector(
    '.toolbar output[for="pinkIntensity"]'
  ).innerHTML = value;
}

export function addPinknessListener() {
  window.onPinkIntensityChange = onPinkIntensityChange;
}
