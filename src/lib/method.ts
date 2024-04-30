import type { Stats } from 'node:fs';

import { constants } from 'node:fs';
import { access, mkdir as mkdir_, open, rm, stat } from 'node:fs/promises';

import { NodePathModule, path as p } from './path.js';
import { isValidRM } from './shared/isValidRM.js';

/**
 * Return the last portion of a path. Similar to the Unix basename command.
 * Often used to extract the file name from a fully qualified path.
 *
 * @param path the path to evaluate.
 * @param suffix optionally, an extension to remove from the result.
 * @throws {TypeError} if `path` is not a string or if `ext` is given and is not a string.
 */
export const basename: NodePathModule['basename'] = p().basename;
/**
 * The platform-specific file delimiter. ';' or ':'.
 */
export const delimiter: NodePathModule['delimiter'] = p().delimiter;
/**
 * Return the directory name of a path. Similar to the Unix dirname command.
 *
 * @param path the path to evaluate.
 * @throws {TypeError} if `path` is not a string.
 */
export const dirname: NodePathModule['dirname'] = p().dirname;
/**
 * Return the extension of the path, from the last '.' to end of string in the last portion of the path.
 * If there is no '.' in the last portion of the path or the first character of it is '.', then it returns an empty string.
 *
 * @param path the path to evaluate.
 * @throws {TypeError} if `path` is not a string.
 */
export const extname: NodePathModule['extname'] = p().extname;
/**
 * Returns a path string from an object - the opposite of parse().
 *
 * @param pathObject path to evaluate.
 */
export const format: NodePathModule['format'] = p().format;
/**
 * Determines whether {path} is an absolute path. An absolute path will always resolve to the same location, regardless of the working directory.
 *
 * If the given {path} is a zero-length string, `false` will be returned.
 *
 * @param path path to test.
 * @throws {TypeError} if `path` is not a string.
 */
export const isAbsolute: NodePathModule['isAbsolute'] = p().isAbsolute;
/**
 * Join all arguments together and normalize the resulting path.
 *
 * @param paths paths to join.
 * @throws {TypeError} if any of the path segments is not a string.
 */
export const join: NodePathModule['join'] = p().join;
/**
 * Normalize a string path, reducing '..' and '.' parts.
 * When multiple slashes are found, they're replaced by a single one; when the path contains a trailing slash, it is preserved. On Windows backslashes are used.
 *
 * @param path string path to normalize.
 * @throws {TypeError} if `path` is not a string.
 */
export const normalize: NodePathModule['normalize'] = p().normalize;
/**
 * Returns an object from a path string - the opposite of format().
 *
 * @param path path to evaluate.
 * @throws {TypeError} if `path` is not a string.
 */
export const parse: NodePathModule['parse'] = p().parse;
/**
 * Posix specific pathing.
 * Same as parent object on posix.
 */
export const posix: NodePathModule['posix'] = p().posix;
/**
 * Solve the relative path from {from} to {to} based on the current working directory.
 * At times we have two absolute paths, and we need to derive the relative path from one to the other. This is actually the reverse transform of path.resolve.
 *
 * @throws {TypeError} if either `from` or `to` is not a string.
 */
export const relative: NodePathModule['relative'] = p().relative;
/**
 * The right-most parameter is considered {to}. Other parameters are considered an array of {from}.
 *
 * Starting from leftmost {from} parameter, resolve {to} to an absolute path.
 *
 * If {to} isn't already absolute, {from} arguments are prepended in right to left order,
 * until an absolute path is found. If after using all {from} paths still no absolute path is found,
 * the current working directory is used as well. The resulting path is normalized,
 * and trailing slashes are removed unless the path gets resolved to the root directory.
 *
 * @param paths A sequence of paths or path segments.
 * @throws {TypeError} if any of the arguments is not a string.
 */
export const resolve: NodePathModule['resolve'] = p().resolve;
/**
 * The platform-specific file separator. '\\' or '/'.
 */
export const sep: NodePathModule['sep'] = p().sep;
/**
 * On Windows systems only, returns an equivalent namespace-prefixed path for the given path.
 * If path is not a string, path will be returned without modifications.
 * This method is meaningful only on Windows system.
 * On POSIX systems, the method is non-operational and always returns path without modifications.
 */
export const toNamespacedPath: NodePathModule['toNamespacedPath'] = p().toNamespacedPath;
/**
 * Windows specific pathing.
 * Same as parent object on windows
 */
export const win32: NodePathModule['win32'] = p().win32;

// custom path methods

/**
 * Returns the correct path module for the current operating system.
 *
 * @return {NodePathModule['posix'] | NodePathModule['win32']} The path module appropriate for the current operating system.
 */
export function cross_path(): NodePathModule['posix'] | NodePathModule['win32'] {
  return process.platform === 'win32' ? p().win32 : p().posix;
}

/**
 * <u>Checks if the provided path is a valid directory.</u>
 * A valid directory answers 'yes' to the following questions:
 *  - does exist?
 *  - is readable?
 *  - is writable?
 *  - is executable?
 *
 * @param {string} paths - The path to be checked.
 * @return {Promise<string>} - A Promise that resolves with the resolved path if it is a valid directory,
 *                            or rejects with an error message otherwise.
 */
export async function isValid( ...paths: string[] ): Promise<string>{

  let resolve_path: string;
  try {

    resolve_path = p().resolve( ...paths );
  }
  catch ( error ) {
    throw new Error( `Invalid path: ${error.message}` );
  }

  const permissions = await access( resolve_path, constants.F_OK | constants.R_OK | constants.W_OK | constants.X_OK )
    .catch( error => error );

  if( permissions instanceof Error ) {
    throw new Error( `Invalid path: ${permissions.message}` );
  }

  const isDirectory: Stats = await stat( resolve_path ).catch( error => error );
  if ( isDirectory.isDirectory() ){
    return resolve_path;
  }
  else if ( isDirectory instanceof Error ) {
    throw new Error( `${isDirectory.message}` );
  }
  else {
    throw new Error( `Invalid path: ${resolve_path} is not a directory.` );
  }
}

/**
 * Makes a new directory at the specified path.
 *
 * **it doesn't make recursively, and it throws a StatError inherited from isValid()**
 *
 * @param {string} path - The path where the directory should be created.
 * @returns {Promise<string>} - A Promise that resolves to a message indicating that the directory was successfully created.
 * @throws {Error} - If the path is invalid or if the directory creation fails.
 */
export async function mkdir( path: string ): Promise<string> {

  let absolute_path: string = path;
  if( ! p().isAbsolute( absolute_path ) ){
    try {

      absolute_path = p().resolve( path );
    }
    catch ( error ) {
      throw new Error( `Invalid path: ${error.message}` );
    }
  }

  const isValidDirectory = await isValid( p().dirname( absolute_path ) )
    .catch( error => error );

  if ( isValidDirectory instanceof Error ) {
    throw new Error( `Invalid path: ${isValidDirectory.message}` );
  }

  const mkdirError = await mkdir_( absolute_path, { mode: 0o755 } )
    .catch( error => error );

  if ( mkdirError instanceof Error ) {
    throw new Error( `mkdir failed: ${mkdirError.message}` );
  }

  return `made directory -> ${absolute_path}`;
}

export async function touch( paths: string[] ): Promise<string>{

  const touched: string[] = [];

  if( ! Array.isArray( paths ) ){
    throw new Error( `paths argument must be an Array also if it is only one entry.` );
  }

  const absolute_path = paths;

  for ( const path_ of paths ) {
    if( ! p().isAbsolute( path_ ) ){
      try {
        absolute_path.push( p().resolve( path_ ) );
      }
      catch ( error ) {
        throw new Error( `Invalid path: ${error.message} given path: ${path_}` );
      }
    }

    const isValidDirectory = await isValid( p().dirname( path_ ) )
      .catch( error => error );

    if ( isValidDirectory instanceof Error ) {
      throw new Error( `Invalid path: ${isValidDirectory.message} given path: ${path_}` );
    }
  }

  for ( const path_ of absolute_path ) {
    const openFile = await open( path_, 'w' )
      .catch( error => error );

    if ( openFile instanceof Error ) {
      throw new Error( `touch failed: ${openFile.message} given path: ${path_}` );
    }

    await openFile.close();

    touched.push( `touched -> ${path_}` );

  }

  return touched.join( '\n' );
}

/**
 * Removes files from the specified paths.
 *
 * @param {string[]} paths - An array of file paths to be removed.
 * @returns {Promise<string>} - A promise that resolves to a string with the result of the removal operation.
 * @throws {Error} - If the paths argument is not an array or if any of the specified paths is invalid.
 */
export async function rm_file( paths: string[] ): Promise<string>{

  if( ! Array.isArray( paths ) ){
    throw new Error( `paths argument must be an Array also if it is only one entry.` );
  }

  const absolute_path = await isValidRM( paths, true )
    .catch( error => error );

  if ( absolute_path instanceof Error ) {
    throw new Error( `Invalid path: ${absolute_path.message}` );
  }

  for ( const path_ of absolute_path ) {

    const rmFile = await rm( path_ ).catch( error => error );

    if ( rmFile instanceof Error ) {
      throw new Error( `rm failed: ${rmFile.message} given path: ${path_}` );
    }

    this.rm.push( `rm -> ${path_}` );
  }

  return this.rm.join( '\n' );
}

/**
 * Removes directories.
 *
 * @param {string[]} paths - An array of paths to be removed.
 * @return {Promise<string>} - A promise that resolves with a string containing information about the removed paths.
 * @throws {Error} - If the 'paths' argument is not an array or if any of the paths are invalid.
 */
export async function rm_dir( paths: string[] ): Promise<string>{

  if( ! Array.isArray( paths ) ){
    throw new Error( `paths argument must be an Array also if it is only one entry.` );
  }

  const absolute_path = await isValidRM( paths )
    .catch( error => error );

  if ( absolute_path instanceof Error ) {
    throw new Error( `Invalid path: ${absolute_path.message}` );
  }

  for ( const path_ of absolute_path ) {

    const rmDir = await rm( path_, { recursive: true } ).catch( error => error );

    if ( rmDir instanceof Error ) {
      throw new Error( `rm failed: ${rmDir.message} given path: ${path_}` );
    }

    this.rm.push( `rm -> ${path_}` );
  }

  return this.rm.join( '\n' );
}


export async function isFile( ...paths: string[] ): Promise<string>{

  let resolve_path: string;
  try {

    resolve_path = p().resolve( ...paths );
  }
  catch ( error ) {
    throw new Error( `Invalid path: ${error.message}` );
  }

  const permissions = await access( resolve_path, constants.F_OK | constants.R_OK | constants.W_OK )
    .catch( error => error );

  if( permissions instanceof Error ) {
    throw new Error( `Invalid path: ${permissions.message}` );
  }

  const isFile = await stat( resolve_path ).catch( error => error );
  if ( isFile.isFile() ){
    return resolve_path;
  }
  else if ( isFile instanceof Error ) {
    throw new Error( `${isFile.message}` );
  }
  else {
    throw new Error( `Invalid path: ${resolve_path} is not a file.` );
  }
}

export function cwd(): string {

  return process.cwd();
}

export async function isExecutable( ...paths: string[] ): Promise<string>{

  let resolve_path: string;
  try {

    resolve_path = p().resolve( ...paths );
  }
  catch ( error ) {
    throw new Error( `Invalid path: ${error.message}` );
  }

  const permissions = await access( resolve_path, constants.F_OK | constants.R_OK | constants.W_OK | constants.X_OK )
    .catch( error => error );

  if( permissions instanceof Error ) {
    throw new Error( `Invalid path: ${permissions.message}` );
  }

  return resolve_path;
}

export async function async_import_meta_resolve( specified: string, parent?: URL|string ): Promise<Error|string>{

  return new Promise( ( resolve, reject ) => {

    try {
      // ⚠️ node.js v20 is no more a Promise
      resolve( import.meta.resolve( specified, parent ) );
    }
    catch ( Error ) {

      reject( Error );
    }
  } );
}
