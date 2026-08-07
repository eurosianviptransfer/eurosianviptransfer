declare module 'react-dom/server' {
  export function renderToString(...args: any[]): string;
  export function renderToStaticMarkup(...args: any[]): string;
  export function renderToReadableStream(...args: any[]): any;
}

declare module 'react-dom/server.node' {
  export * from 'react-dom/server';
}
