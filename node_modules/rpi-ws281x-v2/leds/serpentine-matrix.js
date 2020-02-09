module.exports = class SerpentineMatrix {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }

    getMap() {
        const map = new Uint32Array(this.width * this.height);
        for (let i = 0; i < map.length; i++) {
            const row = Math.floor(i / this.height);

            let target = i;

            if (row % 2 === 1) {
                target = (row * this.height) - i + ((row + 1) * this.height) - 1;
            }

            map[i] = target;
        }

        return map;
    }

    getByCoordinate(x, y) {
        let row = x + 1;
        let col = y + 1;
        let index = (this.height * row) - col;

        return index <= (this.width * this.height) ? index : ((this.width * this.height) - 1);
    }
};
