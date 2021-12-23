const board = {
  elem: document.querySelector(".board"),
  body: new Tag({ tagName: "body", keyword: [], attr: [] }),
  ready: null,
  selected: null,
  grid,

  init(width, height) {
    this.elem.appendChild(this.body.elem);
    this.body.show();
    this.grid.init(this);
    const { size } = this.grid;
    this.body.setStyle(trim(width, size), trim(height, size), 0, 0, this.grid)
  },

  searchElem(target, start = this.body) {
    const visited = new Map();
    const queue = [start];
    let tag;

    while (queue.length) {
      tag = queue.shift();
      if (tag.elem === target) break;
      if (!visited.has(tag)) {
        visited.set(tag, null);
        queue.push(...tag.children);
      }
    }
    return tag;
  },

  getOffset(event) {
    const { clientX, clientY } = event;
    const { x, y } = board.elem.getBoundingClientRect();
    const { scrollLeft, scrollTop } = board.elem;
    return [ clientX - x + scrollLeft, clientY - y + scrollTop ];
  },

  add(data) {
    const { keyword } = data;
    const tag = new Tag(data, {});
    const { size } = grid;
    if (keyword.includes("block")) {
      tag.setStyle(this.body.width - size * 2 + 1, size * 3 + 1, 0, 0, grid);
    } else {
      tag.setStyle(size * 6 + 1, size * 3 + 1, 0, 0, grid);
    }
    tag.setState("ready");
    board.elem.appendChild(tag.elem);
    board.ready = tag;
  },

  delete(tag) {
    board.elem.removeChild(tag.elem);
  }
};

const clickHandler = (event) => {
  const { ready } = board;
  if (ready) {
    const [ x, y ] = board.getOffset(event);
    ready.setPos(x, y, grid);
    ready.setState("located");
  } else {
    const { target } = event;
    board.selected = board.searchElem(target);
    board.selected.setState("selected");
  }
};

const mouseoverHandler = (event) => {
  const { ready } = board;
  if (!ready) return;
  const [ x, y ] = board.getOffset(event);
  ready.setPos(x, y, grid);
  ready.show();
};

const mousemoveHandler = (event) => {
  const { ready } = board;
  if (!ready) return;
  const [ x, y ] = board.getOffset(event);
  ready.setPos(x, y, grid);
};

const mouseoutHandler = () => {
  const { ready } = board;
  if (!ready) return;
  ready.hide();
  ready.setState("none");
};

board.elem.addEventListener("click", clickHandler);
board.elem.addEventListener("mouseover", mouseoverHandler);
board.elem.addEventListener("mousemove", mousemoveHandler);
board.elem.addEventListener("mouseout", mouseoutHandler);

board.init(1296, 800);