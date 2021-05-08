/** Total amount of images in archive */
const amount = 766;
/** Amount of images in each scroll chunk */
const chunkSize = 50;

const root = document.querySelector(".grid");
const columnInput = document.querySelector('.toolbar input[id="columnCount"]');
const columnOutput = document.querySelector(
  '.toolbar output[for="columnCount"]'
);

let numbers = buildDataset('random');
let initialNumbers = [...numbers];

function buildDataset(type) {
  let numbers = [...Array(amount + 1).keys()].slice(1);
  if (type === 'random') {
    shuffle(numbers);
  }
  if (type === 'newest') {
    numbers.reverse();
  }
  numbers = buildChunks(numbers);
  return numbers;
}

function buildColumn() {
  const column = document.createElement("div");
  column.className = "column";
  return column;
}

function buildImage(i) {
  const img = document.createElement("img");
  img.src = `gifs/sissy_${i}.webp`;
  img.loading = "lazy";
  img.className = "grid-item";

  img.onload = rebalanceColumns;
  return img;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function buildChunks(array) {
  return array.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / chunkSize);

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = []; // start a new chunk
    }

    resultArray[chunkIndex].push(item);

    return resultArray;
  }, []);
}

export function addChunkToUI() {
  if (!numbers.length) return;
  const images = numbers.shift().map(buildImage);
  insertContent(images);
}

function insertColumns(columnCount = 5) {
  for (let index = 0; index < columnCount; index++) {
    const column = buildColumn();
    root.appendChild(column);
  }
}

function getSmallestColumn(columns) {
  return [...columns].reduce((result, column) => {
    if (result.offsetHeight > column.offsetHeight) {
      return column;
    }
    return result;
  });
}

function getLargestColumn(columns) {
  return [...columns].reduce((result, column) => {
    if (result.offsetHeight < column.offsetHeight) {
      return column;
    }
    return result;
  });
}

function insertContent(images) {
  const columns = document.querySelectorAll(".column");
  images.forEach((image) => {
    const column = getSmallestColumn(columns);
    column.appendChild(image);
  });
}

function columnsImbalanced(columns) {
  const smallestColumn = getSmallestColumn(columns);
  const largestColumn = getLargestColumn(columns);
  return smallestColumn.offsetHeight + 500 < largestColumn.offsetHeight;
}

function rebalanceColumns() {
  const columns = document.querySelectorAll(".column");
  let infinityGuard = 0;
  while (++infinityGuard < 50 && columnsImbalanced(columns)) {
    const smallestColumn = getSmallestColumn(columns);
    const largestColumn = getLargestColumn(columns);
    const movedItem = [...largestColumn.childNodes].pop();
    smallestColumn.appendChild(movedItem);
  }
}

const getDefaultInitialColumnCount = () =>
  Math.round(document.documentElement.offsetWidth / 400) || 1;

function handleColumnCountChange(columnCount) {
  initialize(columnCount);
}

function handleChangeDataset(type) {
  numbers = buildDataset(type);
  initialNumbers = [...numbers];
  initialize();
}

export function initialize(columnCount = getDefaultInitialColumnCount()) {
  // Reset everything in case we're re-rendering
  numbers = [...initialNumbers];
  root.textContent = "";

  columnOutput.innerText = columnCount;
  columnInput.value = columnCount;

  insertColumns(columnCount);
  addChunkToUI();
}

let resizeId;
function handleResize() {
  if (resizeId) {
    clearTimeout(resizeId);
  }

  resizeId = setTimeout(() => {
    initialize();
    resizeId = null;
  }, 300);
}

window.addChunkToUI = addChunkToUI;
window.onColumnCountChange = handleColumnCountChange;
window.onChangeDataset = handleChangeDataset;
window.onresize = handleResize;
