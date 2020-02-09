import CanvasMatrix from '../../leds/canvas-matrix';

test('should initiate CanvasMatrix', () => {
    const matrix = new CanvasMatrix(2,2);
    expect(matrix).toBeInstanceOf(CanvasMatrix);
});

test('should create a correct map', () => {
   const matrix = new CanvasMatrix(4, 4);
   const result = matrix.getMap();

   expect(result[0]).toBe(0);
   expect(result[1]).toBe(4);
   expect(result[2]).toBe(8);
   expect(result[3]).toBe(12);
   expect(result[4]).toBe(13);
   expect(result[5]).toBe(9);
   expect(result[6]).toBe(5);
   expect(result[7]).toBe(1);
   expect(result[8]).toBe(2);
   expect(result[9]).toBe(6);
   expect(result[10]).toBe(10);
   expect(result[11]).toBe(14);
   expect(result[12]).toBe(15);
   expect(result[13]).toBe(11);
   expect(result[14]).toBe(7);
   expect(result[15]).toBe(3);
});

test('should retrieve the right pixel', () => {
    const matrix = new CanvasMatrix(4, 4);

    expect(matrix.getByCoordinate(0, 0)).toBe(0);
    expect(matrix.getByCoordinate(0, 1)).toBe(4);
    expect(matrix.getByCoordinate(0, 2)).toBe(8);
    expect(matrix.getByCoordinate(0, 3)).toBe(12);
    expect(matrix.getByCoordinate(1, 0)).toBe(1);
    expect(matrix.getByCoordinate(1, 1)).toBe(5);
    expect(matrix.getByCoordinate(1, 2)).toBe(9);
    expect(matrix.getByCoordinate(1, 3)).toBe(13);
    expect(matrix.getByCoordinate(2, 0)).toBe(2);
    expect(matrix.getByCoordinate(2, 1)).toBe(6);
    expect(matrix.getByCoordinate(2, 2)).toBe(10);
    expect(matrix.getByCoordinate(2, 3)).toBe(14);
    expect(matrix.getByCoordinate(3, 0)).toBe(3);
    expect(matrix.getByCoordinate(3, 1)).toBe(7);
    expect(matrix.getByCoordinate(3, 2)).toBe(11);
    expect(matrix.getByCoordinate(3, 3)).toBe(15);
});
