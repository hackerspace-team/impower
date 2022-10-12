import { CommandData } from "../../../command/CommandData";

export interface ChoiceCommandData extends CommandData<"ChoiceCommand"> {
  operator: "+" | "-" | "start" | "end";
  value: string;
  calls: Record<string, { name: string; values: string[] }>;
  content: string;
  order: number;
}