import { path as p } from '../path.js';

export interface IPathNormalize { normalize( path: string ): string; }
export class PathNormalize implements IPathNormalize {
  normalize( path: string ): string {
    return p().normalize( path );
  }
}
