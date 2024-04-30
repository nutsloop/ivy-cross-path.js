import { type NodePathModule, path } from '../path.js';

export interface IPathDelimiter { readonly delimiter: NodePathModule['delimiter']; }
export class PathDelimiter implements IPathDelimiter{
  readonly delimiter: NodePathModule['delimiter'] = path().delimiter;
}
