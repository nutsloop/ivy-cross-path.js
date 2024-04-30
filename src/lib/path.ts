import type { FormatInputPathObject, ParsedPath } from 'node:path';

import { default as node_path_module } from 'node:path';

import { type IPathAsyncImportMetaResolve, PathAsyncImportMetaResolve } from './class/async-import-meta-resolve.js';
import { type IPathBasename, PathBasename } from './class/basename.js';
import { type IPathCrossPlatform, PathCrossPlatform } from './class/cross-platform.js';
import { type IPathDelimiter, PathDelimiter } from './class/delimiter.js';
import { type IPathDirname, PathDirname } from './class/dirname.js';
import { type IPathExtname, PathExtname } from './class/extname.js';
import { type IPathFormat, PathFormat } from './class/format.js';
import { type IPathIsAbsolute, PathIsAbsolute } from './class/is-absolute.js';
import { type IPathIsValid, PathIsValid } from './class/is-valid.js';
import { type IPathJoin, PathJoin } from './class/join.js';
import { type IPathMKDir, PathMKDir } from './class/mkdir.js';
import { type IPathNormalize, PathNormalize } from './class/normalize.js';
import { type IPathParse, PathParse } from './class/parse.js';
import { type IPathPosix, PathPosix } from './class/posix.js';
import { IPathProcess, PathProcess } from './class/process.js';
import { type IPathRelative, PathRelative } from './class/relative.js';
import { type IPathResolve, PathResolve } from './class/resolve.js';
import { type IPathRM, PathRM } from './class/rm.js';
import { type IPathSep, PathSep } from './class/sep.js';
import { type IPathToNamespacedPath, PathToNamespacedPath } from './class/to-namespaced-path.js';
import { type IPathTouch, PathTouch } from './class/touch.js';
import { type IPathWin32, PathWin32 } from './class/win32.js';

export type NodePathModule = typeof node_path_module;
type Constructor<T> = new () => T;

interface IBase extends
  IPathAsyncImportMetaResolve,
  IPathBasename,
  IPathCrossPlatform,
  IPathDelimiter,
  IPathDirname,
  IPathExtname,
  IPathFormat,
  IPathIsAbsolute,
  IPathIsValid,
  IPathJoin,
  IPathMKDir,
  IPathNormalize,
  IPathProcess,
  IPathParse,
  IPathPosix,
  IPathRelative,
  IPathResolve,
  IPathRM,
  IPathSep,
  IPathToNamespacedPath,
  IPathTouch,
  IPathWin32
{}

/**
 * <u>Wrapper for the node path module.</u>
 *
 * The `node:path` module provides utilities for working with file and directory
 * paths. It can be accessed using:
 * @see [source](https://github.com/nodejs/node/blob/v20.2.0/lib/path.js)
 */
export function path(): NodePathModule {
  return node_path_module;
}

export class Base implements IBase{
  readonly __dirname: string;
  readonly __filename: string;
  readonly delimiter: NodePathModule['delimiter'] = node_path_module.delimiter;
  posix: NodePathModule['posix'] = node_path_module.posix;
  rm: string[] = [];
  sep: '/' | '\\' = node_path_module.sep;
  touched: string[] = [];
  win32: NodePathModule['win32'] = node_path_module.win32;
  constructor( file_url?: string ) {

    if( file_url === undefined ) {
      const this_path = new URL( import.meta.url ).pathname;
      this.__filename = this.resolve( this_path, '..', '..', 'index.js' );
      this.__dirname = this.dirname( this.__filename );
    }
    else {
      this.__filename = new URL( file_url || import.meta.url ).pathname;
      this.__dirname = this.dirname( this.__filename );
    }
  }
  async_import_meta_resolve( specified: string, parent?: URL | string ): Promise<Error | string> {
    throw new Error( `Method not implemented.${specified}${parent}` );
  }
  basename( path: string, ext?: string ): string{
    throw new Error( `Method not implemented.${path}${ext}` );
  }
  cross_path(): NodePathModule['posix'] | NodePathModule['win32'] {
    throw new Error( `Method not implemented.` );
  }
  cwd(): string{
    throw new Error( `Method not implemented.` );
  }
  dirname( path: string ): string{
    throw new Error( `Method not implemented.${path}` );
  }
  extname( path: string ): string{
    throw new Error( `Method not implemented.${path}` );
  }
  format( path: FormatInputPathObject ): string{
    throw new Error( `Method not implemented.${path}` );
  }
  isAbsolute( path: string ): boolean{
    throw new Error( `Method not implemented.${path}` );
  }
  isExecutable( path: string ): Promise<string> {
    throw new Error( `Method not implemented.${path}` );
  }
  isFile( path: string ): Promise<string> {
    throw new Error( `Method not implemented.${path}` );
  }
  isValid( path: string ): Promise<string> {
    throw new Error( `Method not implemented.${path}` );
  }
  join( ...paths: string[] ): string{
    throw new Error( `Method not implemented.${paths}` );
  }
  mkdir( path: string ): Promise<string> {
    throw new Error( `Method not implemented.${path}` );
  }
  normalize( path: string ): string{
    throw new Error( `Method not implemented.${path}` );
  }
  parse( path: string ): ParsedPath{
    throw new Error( `Method not implemented.${path}` );
  }
  relative( from: string, to: string ): string{
    throw new Error( `Method not implemented.${from}${to}` );
  }
  resolve( ...paths: string[] ): string{
    throw new Error( `Method not implemented.${paths}` );
  }
  rm_dir( paths: string[] ): Promise<string> {
    throw new Error( `Method not implemented.${paths}` );
  }
  rm_file( path: string[] ): Promise<string> {
    throw new Error( `Method not implemented.${path}` );
  }
  toNamespacedPath( path: string ): string{
    throw new Error( `Method not implemented.${path}` );
  }
  touch( paths: string[] ): Promise<string> {
    throw new Error( `Method not implemented.${paths}` );
  }
}

type Extend = Constructor<{}>[];

const Extend: Extend = [
  PathAsyncImportMetaResolve,
  PathBasename,
  PathCrossPlatform,
  PathDelimiter,
  PathDirname,
  PathExtname,
  PathFormat,
  PathIsAbsolute,
  PathIsValid,
  PathJoin,
  PathMKDir,
  PathNormalize,
  PathParse,
  PathPosix,
  PathRelative,
  PathResolve,
  PathProcess,
  PathRM,
  PathSep,
  PathToNamespacedPath,
  PathTouch,
  PathWin32
];

function mixin_flavors( base_constructor: Constructor<Base>, mixin_constructors: Constructor<{}>[] ): void {

  for ( const constructor of mixin_constructors ) {

    const properties = Object.getOwnPropertyNames( constructor.prototype );

    for( const name of properties ) {

      const descriptor = Object.getOwnPropertyDescriptor( constructor.prototype, name );
      Object.defineProperty( base_constructor.prototype, name, descriptor );
    }
  }
}

mixin_flavors( Base, Extend );

/**
 * <u>Wrapper Class for the node path module.</u>
 *
 * adding extra functionalities to file-system paths.
 * @class
 * @extends Base
 * @extends Extend
 */
export class Path extends Base {}
