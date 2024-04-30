import type { NodePathModule } from '../path.js';

import { path } from '../path.js';

export interface IPathWin32 { win32: NodePathModule['win32']; }
export class PathWin32 implements IPathWin32 {
  win32: NodePathModule['win32'] = path().win32;
}
