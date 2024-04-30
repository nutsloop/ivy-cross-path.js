import { constants } from 'node:fs';
import { access, stat } from 'node:fs/promises';

import { path } from '../path.js';

export interface IPathIsValid {
  isExecutable( path: string ): Promise<string>;
  isFile( path: string ): Promise<string>;
  isValid( path: string ): Promise<string>;
}

export class PathIsValid implements IPathIsValid{

  async isExecutable( ...paths: string[] ): Promise<string>{

    let resolve_path: string;
    try {

      resolve_path = path().resolve( ...paths );
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

  /**
   * Checks if the given path resolves to a file.
   *
   * @param {...string} paths - The paths to check.
   * @returns {Promise<string>} - Resolves with the resolved path if it is a file.
   * @throws {Error} - Throws an error if the path is invalid, not a file or if there is a permission issue.
   */
  async isFile( ...paths: string[] ): Promise<string>{

    let resolve_path: string;
    try {

      resolve_path = path().resolve( ...paths );
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

  /**
   * <u>Checks if the provided path is a valid directory.</u>
   * A valid directory answers 'yes' to the following questions:
   *  - does exist?
   *  - is readable?
   *  - is writable?
   *  - is executable?
   *
   * @param {string[]} paths - The path to be checked.
   * @return {Promise<string>} - A Promise that resolves with the resolved path if it is a valid directory,
   *                            or rejects with an error message otherwise.
   */
  async isValid( ...paths: string[] ): Promise<string>{

    let resolve_path: string;
    try {

      resolve_path = path().resolve( ...paths );
    }
    catch ( error ) {
      throw new Error( `Invalid path: ${error.message}` );
    }

    const permissions = await access( resolve_path, constants.F_OK | constants.R_OK | constants.W_OK | constants.X_OK )
      .catch( error => error );

    if( permissions instanceof Error ) {
      throw new Error( `Invalid path: ${permissions.message}` );
    }

    const isDirectory = await stat( resolve_path ).catch( error => error );
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
}
