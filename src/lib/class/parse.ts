import type { ParsedPath } from 'node:path';

import { path as p } from '../path.js';

export interface IPathParse { parse( path: string ): ParsedPath; }
export class PathParse implements IPathParse {
  parse( path: string ): ParsedPath {
    return p().parse( path );
  }
}
