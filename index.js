

function createPoints() {
  const points = [];
  for (let i = 0; i < 30; i += 1) {
    for (let j = 0; j < 50; j += 1) {
      points.push({ x: j, y: i });
    }
  }
  points.forEach((point) => {
    point.type = Math.random() > 0.22 ? 'r' : 'o';
  })
  return points;
}

function createMap() {
  const mapDom = document.querySelector('#map');
  mapDom.innerHTML = '';
  const points = createPoints();
  const mapContext = points.reduce((total, current) => {
    return `${total}
    <div 
      id="item-${current.x}-${current.y}" 
      data-id="item-${current.x}-${current.y}"
      data-x="${current.x}"
      data-y="${current.y}"
      data-type="${current.type}"
      class="map__item map__item_${current.type}" 
      style="top: ${current.y * 20}px; left: ${current.x * 20}px;"
    ></div>`
  }, '');
  mapDom.innerHTML = mapContext;
}

let start = null;
let end = null;


(function () {
  const mapDom = document.querySelector('#map');
  const resetBtn = document.querySelector('#reset-map');
  createMap();
  resetBtn.addEventListener('click', createMap);

  mapDom.addEventListener('click', (e) => {
    const { dataset } = e.target;
    if (dataset.type === 'o') return;
    if (!start && !end) {
      start = { id: dataset.id, x: Number(dataset.x), y: Number(dataset.y) }
    } else if (start && !end) {
      end = { id: dataset.id, x: Number(dataset.x), y: Number(dataset.y) }
    } else if (start && end) {
      start = { id: dataset.id, x: Number(dataset.x), y: Number(dataset.y) }
      end = null;
    }
    console.log(start, end)
  })
})()