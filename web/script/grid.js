/** Total amount of images in archive */
const amount = 766;
//const amount = 100;
/** Amount of images in each scroll chunk */
const chunkSize = 50;

const root = document.querySelector(".grid");

function addImage(i) {
  const img = document.createElement("img");
  img.src = `gifs/sissy_${i}.webp`;
  img.loading = "lazy";

  const a = document.createElement("a");
  a.target = "_blank";
  a.className = "link";

  a.appendChild(img);
  root.appendChild(a);
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

let numbers = [...Array(amount + 1).keys()].slice(1);
shuffle(numbers);
numbers = buildChunks(numbers);

export function addChunkToUI() {
  for (const i of numbers.pop()) {
    addImage(i);
  }
}
