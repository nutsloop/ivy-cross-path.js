import { path as p } from '../path.js';

export interface IPathToNamespacedPath { toNamespacedPath( path: string ): string; }
export class PathToNamespacedPath implements IPathToNamespacedPath {
  toNamespacedPath( path: string ): string {
    return p().toNamespacedPath( path );
  }
}
