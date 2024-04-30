import { path as p } from '../path.js';

export interface IPathBasename { basename( path: string, ext?: string ): string; }
export class PathBasename implements IPathBasename {
  basename( path: string, ext?: string ): string {
    return p().basename( path, ext );
  }
}
