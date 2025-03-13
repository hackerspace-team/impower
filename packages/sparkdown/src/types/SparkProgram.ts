import { SparkDiagnostic } from "./SparkDiagnostic";
import { SparkdownRuntimeFormat } from "./SparkdownRuntimeFormat";

export interface SparkProgram {
  uri: string;
  scripts: Record<string, number>;
  compiled?: SparkdownRuntimeFormat;
  context?: {
    [type: string]: { [name: string]: any };
  };
  diagnostics?: {
    [uri: string]: SparkDiagnostic[];
  };
  pathToLocation: {
    [path: string]: [
      scriptIndex: number,
      startLine: number,
      startColumn: number,
      endLine: number,
      endColumn: number
    ];
  };
  functionLocations: {
    [name: string]: [
      scriptIndex: number,
      startLine: number,
      startColumn: number,
      endLine: number,
      endColumn: number
    ];
  };
  version?: number;
}
