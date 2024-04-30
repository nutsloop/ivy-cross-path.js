// path.relative
import { path as p } from '../path.js';

export interface IPathRelative { relative( from: string, to: string ): string; }
export class PathRelative implements IPathRelative {
  relative( from: string, to: string ): string {
    return p().relative( from, to );
  }
}
