import { mkdir } from 'node:fs/promises';

import { isValid } from '../method.js';
import { path as p } from '../path.js';

export interface IPathMKDir { mkdir( path: string ): Promise<string>; }
export class PathMKDir implements IPathMKDir {

  /**
   * Makes a new directory at the specified path.
   *
   * **it doesn't make recursively, and it throws a StatError inherited from isValid()**
   *
   * @param {string} path - The path where the directory should be created.
   * @returns {Promise<string>} - A Promise that resolves to a message indicating that the directory was successfully created.
   * @throws {Error} - If the path is invalid or if the directory creation fails.
   */
  async mkdir( path: string ): Promise<string> {

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

    const mkdirError = await mkdir( absolute_path, { mode: 0o755 } )
      .catch( error => error );

    if ( mkdirError instanceof Error ) {
      throw new Error( `mkdir failed: ${mkdirError.message}` );
    }

    return `made directory -> ${absolute_path}`;
  }
}
