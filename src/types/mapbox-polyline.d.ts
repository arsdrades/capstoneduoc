declare module '@mapbox/polyline' {
    const polyline: {
      decode: (encoded: string, precision?: number) => number[][];
      encode: (coordinates: number[][], precision?: number) => string;
    };
    export default polyline;
  }