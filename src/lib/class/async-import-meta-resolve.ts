export interface IPathAsyncImportMetaResolve { async_import_meta_resolve( specified: string, parent?: URL | string ): Promise<Error | string>; }

export class PathAsyncImportMetaResolve implements IPathAsyncImportMetaResolve {

  async async_import_meta_resolve( specified: string, parent?: URL | string ): Promise<Error | string> {

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
}
