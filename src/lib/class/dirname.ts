import { path as p } from '../path.js';

export interface IPathDirname { dirname( path: string ): string; }
export class PathDirname implements IPathDirname{
  dirname( path: string ): string{
    return p().dirname( path );
  }
}
