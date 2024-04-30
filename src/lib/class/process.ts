export interface IPathProcess { cwd(): string; }
export class PathProcess implements IPathProcess{
  cwd(): string {

    return process.cwd();
  }
}
