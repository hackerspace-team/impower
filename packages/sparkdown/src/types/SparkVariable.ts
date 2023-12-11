import { SparkField } from "./SparkField";
import { SparkRange } from "./SparkRange";

export interface SparkVariable extends SparkRange {
  tag: string;
  line: number;
  from: number;
  to: number;
  indent: number;
  type: string;
  name: string;
  value: string;
  compiled: any;
  fields?: SparkField[];
  implicit?: boolean;

  ranges?: {
    type?: SparkRange;
    name?: SparkRange;
    value?: SparkRange;
  };
}
