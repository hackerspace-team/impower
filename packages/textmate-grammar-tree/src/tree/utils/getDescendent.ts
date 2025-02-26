import { type SyntaxNode } from "@lezer/common";
import { type GrammarSyntaxNode } from "../types/GrammarSyntaxNode";

export const getDescendent = <T extends string>(
  descendentTypeName: T,
  parent: SyntaxNode
): GrammarSyntaxNode<T> | undefined => {
  if (parent) {
    const cur = parent?.node.cursor();
    while (cur.from <= parent.to) {
      if (cur.name === descendentTypeName) {
        return cur.node as GrammarSyntaxNode<T>;
      }
      if (!cur?.next()) {
        break;
      }
    }
  }
  return undefined;
};
