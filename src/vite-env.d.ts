/// <reference types="vite/client" />

declare module '*.svg' {
    const filePath: string;
    export default filePath;
}