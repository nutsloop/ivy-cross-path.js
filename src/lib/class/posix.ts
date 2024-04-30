import type { NodePathModule } from '../path.js';

import { path } from '../path.js';

export interface IPathPosix { posix: NodePathModule['posix']; }
export class PathPosix implements IPathPosix {
  posix: NodePathModule['posix'] = path().posix;
}
