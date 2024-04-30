import { isValid } from '../method.js';
import { path } from '../path.js';

export async function isValidRM( paths: string[], file:boolean = false ): Promise<string[]>{

  const absolute_path: string[] = [];

  for ( const path_ of paths ) {

    let internal_absolute_path: string;

    if( ! path().isAbsolute( path_ ) ){

      try {

        absolute_path.push( path().resolve( path_ ) );
        internal_absolute_path = path().resolve( path_ );
      }
      catch ( error ) {
        throw new Error( `Invalid path: ${error.message} given path: ${path_}` );
      }
    }
    else {

      absolute_path.push( path_ );
      internal_absolute_path = path_;
    }
    if( file === true ){

      internal_absolute_path = path().dirname( internal_absolute_path );
    }

    const isValidDirectory = await isValid( internal_absolute_path )
      .catch( error => error );

    if ( isValidDirectory instanceof Error ) {
      throw new Error( `Invalid path: ${isValidDirectory.message} given path: ${internal_absolute_path}` );
    }
  }

  return absolute_path;
}
