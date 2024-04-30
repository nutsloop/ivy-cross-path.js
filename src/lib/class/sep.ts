import type { NodePathModule } from '../path.js';

import { path } from '../path.js';

export interface IPathSep { sep: NodePathModule['sep']; }
export class PathSep implements IPathSep {
  sep: NodePathModule['sep'] = path().sep;
}
