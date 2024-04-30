import { type NodePathModule, path } from '../path.js';

export interface IPathCrossPlatform { cross_path(): NodePathModule['posix'] | NodePathModule['win32']; }
export class PathCrossPlatform implements IPathCrossPlatform{
  cross_path(): NodePathModule['posix'] | NodePathModule['win32'] {
    return process.platform === 'win32' ? path().win32 : path().posix;
  }
}
