import { path } from '../path.js';

export interface IPathJoin { join( ...paths: string[] ): string; }
export class PathJoin implements IPathJoin {
  join( ...paths: string[] ): string {
    return path().join( ...paths );
  }
}
