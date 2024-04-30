import { rm } from 'node:fs/promises';

import { isValidRM } from '../shared/isValidRM.js';

export interface IPathRM{
  rm: string[];
  rm_dir( paths: string[] ): Promise<string>;
  rm_file( path: string[] ): Promise<string>;
}

export class PathRM implements IPathRM{

  rm: string[] = [];

  async rm_dir( paths: string[] ): Promise<string>{

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
  async rm_file( paths: string[] ): Promise<string>{

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
}
