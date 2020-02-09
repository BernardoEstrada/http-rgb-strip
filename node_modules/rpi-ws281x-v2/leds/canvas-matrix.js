module.exports = class CanvasMatrix {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }

    getMap() {
        const map = new Uint32Array(this.width * this.height);
        for (let i = 0; i < map.length; i++) {
            let row = Math.floor(i / this.height);
            let col = this.height - (i % this.height) - 1;

            let target = i * this.width;

            if (row % 2 === 1) {
                target = this.width * col + row;
            } else {
                col = (this.height - col) - 1;
                target = (col * this.width) + row;
            }

            map[i] = target;
        }

        return map;
    }

    getByCoordinate(x, y) {
        let row = x;
        let col = y;
        let index = ((this.width * col) + row);

        return index <= (this.width * this.height) ? index : ((this.width * this.height) - 1);
    }
};
