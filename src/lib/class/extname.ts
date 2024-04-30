import { path as p } from '../path.js';

export interface IPathExtname { extname( path: string ): string; }
export class PathExtname implements IPathExtname{
  extname( path: string ): string{
    return p().extname( path );
  }
}
