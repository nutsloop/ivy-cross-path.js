import { open } from 'node:fs/promises';

import { isValid } from '../method.js';
import { path } from '../path.js';

export interface IPathTouch{
  touch( paths: string[] ): Promise<string>;
  touched: string[];
}

export class PathTouch implements IPathTouch{

  touched: string[] = [];

  async touch( paths: string[] ): Promise<string>{

    if( ! Array.isArray( paths ) ){
      throw new Error( `paths argument must be an Array also if it is only one entry.` );
    }

    const absolute_path = [];

    for ( const path_ of paths ) {
      if( ! path().isAbsolute( path_ ) ){
        try {
          absolute_path.push( path().resolve( path_ ) );
        }
        catch ( error ) {
          throw new Error( `Invalid path: ${error.message} given path: ${path_}` );
        }
      }
      else {
        absolute_path.push( path_ );
      }

      const isValidDirectory = await isValid( path().dirname( path_ ) )
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

      this.touched.push( `touched -> ${path_}` );
    }

    return this.touched.join( '\n' );
  }
}
