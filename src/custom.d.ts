/* eslint-disable @typescript-eslint/no-explicit-any */
// src/custom.d.ts
declare module "*.json" {
  const value: any; 
  export default value;
}


declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.gif";
declare module "*.svg";