module.exports = class Matrix {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }

    getMap() {
        const map = new Uint32Array(this.width * this.height);

        for (let i = 0; i < map.length; i++) {
            map[i] = i;
        }

        return map;
    }

    getByCoordinate(x, y) {
        let row = x + 1;
        let col = y + 1;
        let index = 0;

        if (row % 2 === 1) {
            index = (row * this.height) - col;
        } else {
            index = (row * this.height) - (this.height - col) - 1;
        }

        return index <= (this.width * this.height) ? index : ((this.width * this.height) - 1);
    }
}
