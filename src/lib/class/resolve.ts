import { path } from '../path.js';

export interface IPathResolve { resolve( ...paths: string[] ): string; }
export class PathResolve implements IPathResolve {
  resolve( ...paths: string[] ): string {
    return path().resolve( ...paths );
  }
}
