function onPinkIntensityChange(value) {
  document.querySelector('#variableOverrides').innerHTML = `
    html {
      --pinkness-intensity: ${value};
    }
  `;
  document.querySelector(
    '.toolbar output[for="pinkIntensity"]'
  ).innerHTML = value;
}

export function addPinknessListener() {
  window.onPinkIntensityChange = onPinkIntensityChange;
}
