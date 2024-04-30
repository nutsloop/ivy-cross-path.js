import type { FormatInputPathObject } from 'node:path';

import { path as p } from '../path.js';

export interface IPathFormat { format( path: FormatInputPathObject ): string; }
export class PathFormat implements IPathFormat {
  format( path: FormatInputPathObject ): string {
    return p().format( path );
  }
}
