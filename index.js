
const ACTIVE_COLOR = '#19BE6B';
const NORMAL_COLOR = '#E1E3E6';

// 创建点集合
function createPoints() {
  const points = [];
  for (let i = 0; i < 30; i += 1) {
    for (let j = 0; j < 50; j += 1) {
      points.push({ id: `${j}-${i}`, x: j, y: i });
    }
  }
  points.forEach((point) => {
    // o 障碍物
    // r 路径
    point.type = Math.random() > 0.22 ? 'r' : 'o';
  })
  return points;
}

// 创建地图
function createMap(points) {
  const mapDom = document.querySelector('#map');
  mapDom.innerHTML = '';
  const mapContext = points.reduce((total, current) => {
    return `${total}
    <div 
      id="item-${current.id}" 
      data-id="${current.id}"
      data-x="${current.x}"
      data-y="${current.y}"
      data-type="${current.type}"
      class="map__item map__item_${current.type}" 
      style="top: ${current.y * 20}px; left: ${current.x * 20}px;"
    ></div>`
  }, '');
  mapDom.innerHTML = mapContext;
}

// 获取两点间的曼哈顿距离
function getDis(point1, point2) {
  return Math.abs(point2.x - point1.x) + Math.abs(point2.y - point1.y ) - 1;
}

// 设置路径点颜色
function setPointColor(pointId, color) {
  const pointDom = document.querySelector(`#item-${pointId}`);
  pointDom.style.backgroundColor = color;
}

// A* 寻路算法
function findPathByAStar(start, end, points) {
  const pathIds = [];
  let openList = [start];
  const closeList = [];

  function searching() {
    if (openList.length === 0) return;
    const targetId = openList.map((openPoint) => {
      return {
        id: openPoint.id,
        dis: getDis(openPoint, end),
      }
    }).sort((a, b) => a.dis - b.dis)[0].id;

    const targetIndex = openList.findIndex((openPonit) => openPonit.id === targetId);
    const target = openList.find((openPonit) => openPonit.id === targetId);

    const aroundPoints = points.filter((point) => {
      return (point.id === `${target.x}-${target.y - 1}` || 
             point.id === `${target.x + 1}-${target.y}` || 
             point.id === `${target.x}-${target.y + 1}` || 
             point.id === `${target.x - 1}-${target.y}`) 
             && point.type === 'r'
             && !closeList.find((item) => item.id === point.id);
    });
    openList.splice(targetIndex, 1);
    openList = [...openList, ...aroundPoints];
    closeList.push(target);
    if (target.id !== end.id) {
      searching();
    }
  }

  searching(openList);

  return closeList;
}


(function () {
  let points = []; // 地图点的集合
  let start = null; // 起点
  let end = null; // 终点
  let pathIds = []; // 路径点集合
  let isFinding = false; // 是否在寻路

  points = createPoints();
  createMap(points);

  const resetBtn = document.querySelector('#reset-map');
  resetBtn.addEventListener('click', () => {
    if (isFinding) return;

    start = null;
    end = null;
    pathIds = [];
    points = createPoints();
    createMap(points);
  });

  const mapDom = document.querySelector('#map');
  mapDom.addEventListener('click', (e) => {
    const { dataset } = e.target;
    console.log(dataset)
    if (isFinding || dataset.type === 'o') return;

    if (!start && !end) {
      start = { id: dataset.id, x: Number(dataset.x), y: Number(dataset.y) };
      setPointColor(start.id, ACTIVE_COLOR)
    } else if (start && !end) {
      end = { id: dataset.id, x: Number(dataset.x), y: Number(dataset.y) };
      setPointColor(end.id, ACTIVE_COLOR);
      // isFinding = true;
      const path = findPathByAStar(start, end, points);
      path.forEach((item) => {
        setPointColor(item.id, ACTIVE_COLOR);
      });
    } else if (start && end) {
      points.forEach((item) => {
        if (item.type === 'r') {
          setPointColor(item.id, NORMAL_COLOR);
        }
      })

      start = { id: dataset.id, x: Number(dataset.x), y: Number(dataset.y) };
      setPointColor(start.id, ACTIVE_COLOR);
      end = null;
    }
  })
})()