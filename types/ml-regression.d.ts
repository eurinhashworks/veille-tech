declare module 'ml-regression' {
  export class SimpleLinearRegression {
    constructor(x: number[], y: number[]);
    predict(x: number | number[]): number;
  }
}

declare module '@tensorflow/tfjs' {
  export * from '@tensorflow/tfjs-node';
}

