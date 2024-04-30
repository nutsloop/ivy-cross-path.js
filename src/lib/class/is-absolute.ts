import { path as p } from '../path.js';

export interface IPathIsAbsolute { isAbsolute( path: string ): boolean; }
export class PathIsAbsolute implements IPathIsAbsolute {
  isAbsolute( path: string ): boolean {
    return p().isAbsolute( path );
  }
}
