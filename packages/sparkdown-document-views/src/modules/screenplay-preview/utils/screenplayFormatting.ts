import {
  HighlightStyle,
  syntaxHighlighting,
  syntaxTree,
} from "@codemirror/language";
import type { EditorState, Text } from "@codemirror/state";
import { Extension, Range, RangeSet, StateField } from "@codemirror/state";
import { Decoration, DecorationSet, EditorView } from "@codemirror/view";
import { tags } from "@lezer/highlight";
import { SyntaxNodeRef } from "@lezer/common";
import GRAMMAR from "../../../../../sparkdown/language/sparkdown.language-grammar.json";
import { PAGE_POSITIONS } from "../../../../../sparkdown-screenplay/src/constants/PAGE_POSITIONS";
import { SparkdownNodeName } from "../../../../../sparkdown/src/types/SparkdownNodeName";
import TextmateLanguageSupport from "../../../cm-textmate/classes/TextmateLanguageSupport";
import { cachedCompilerProp } from "../../../cm-textmate/props/cachedCompilerProp";
import { printTree } from "../../../cm-textmate/utils/printTree";
import DialogueWidget, {
  DialogueSpec,
} from "../classes/widgets/DialogueWidget";
import TitlePageWidget, {
  TitlePageSpec,
} from "../classes/widgets/TitlePageWidget";
import { MarkupContent } from "../types/MarkupContent";
import { ReplaceSpec } from "../types/ReplaceSpec";
import { RevealSpec } from "../types/RevealSpec";
import { CollapseSpec } from "../types/CollapseSpec";
import CollapseWidget from "../classes/widgets/CollapseWidget";
import { MarkSpec } from "../types/MarkSpec";

const DIALOGUE_WIDTH = "60%";
const CHARACTER_PADDING = "16%";
const PARENTHETICAL_PADDING = "8%";

const DUAL_DIALOGUE_WIDTH = "90%";
const DUAL_CHARACTER_PADDING = "16%";
const DUAL_PARENTHETICAL_PADDING = "8%";

type DecorationSpec =
  | ReplaceSpec
  | RevealSpec
  | CollapseSpec
  | DialogueSpec
  | TitlePageSpec
  | MarkSpec;

const getDialogueLineStyle = (type: string) => {
  const dialogueWidth = DIALOGUE_WIDTH;
  let paddingLeft = "0";
  let paddingRight = "0";
  if (type === "character") {
    paddingLeft = CHARACTER_PADDING;
  }
  if (type === "parenthetical") {
    paddingLeft = PARENTHETICAL_PADDING;
    paddingRight = PARENTHETICAL_PADDING;
  }
  return `display: block; opacity: 1; margin: 0 auto; width: ${dialogueWidth}; padding: 0 ${paddingRight} 0 ${paddingLeft};`;
};

const getDualDialogueLineStyle = (type: string) => {
  const dialogueWidth = DUAL_DIALOGUE_WIDTH;
  let paddingLeft = "0";
  let paddingRight = "0";
  if (type === "character") {
    paddingLeft = DUAL_CHARACTER_PADDING;
  }
  if (type === "parenthetical") {
    paddingLeft = DUAL_PARENTHETICAL_PADDING;
    paddingRight = DUAL_PARENTHETICAL_PADDING;
  }
  return `opacity: 1; margin: 0 auto; width: ${dialogueWidth}; padding: 0 ${paddingRight} 0 ${paddingLeft};`;
};

const LANGUAGE_NAME = "sparkdown";

const LANGUAGE_SUPPORT = new TextmateLanguageSupport(LANGUAGE_NAME, GRAMMAR);

const LANGUAGE_HIGHLIGHTS = HighlightStyle.define([
  { tag: tags.emphasis, fontStyle: "italic" },
  { tag: tags.strong, fontWeight: "bold" },
  { tag: tags.link, textDecoration: "underline", textUnderlineOffset: "5px" },
  { tag: tags.strikethrough, textDecoration: "line-through" },
  { tag: tags.regexp, fontWeight: "bold" },
  { tag: tags.labelName, display: "block", textAlign: "right" },

  {
    tag: tags.special(tags.meta),
    display: "block",
    maxHeight: "0",
    visibility: "hidden",
  },
  { tag: tags.definition(tags.escape), display: "none" },
  { tag: tags.definition(tags.keyword), display: "none" },
  { tag: tags.definition(tags.controlKeyword), display: "none" },
  { tag: tags.definition(tags.typeName), display: "none" },
  { tag: tags.definition(tags.variableName), display: "none" },
  { tag: tags.definition(tags.propertyName), display: "none" },
  { tag: tags.definition(tags.punctuation), display: "none" },
  { tag: tags.definition(tags.content), display: "none" },
  { tag: tags.definition(tags.separator), display: "none" },
  { tag: tags.special(tags.content), display: "none" },
  { tag: tags.comment, display: "none" },
  { tag: tags.blockComment, display: "none" },
  { tag: tags.docComment, display: "none" },

  { tag: tags.macroName, display: "none" },
  { tag: tags.meta, display: "none" },

  {
    tag: tags.contentSeparator,
    display: "block",
    color: "transparent",
    borderBottom: "1px solid #00000033",
  },
]);

const createDecorations = (
  spec: DecorationSpec,
  doc: Text
): Range<Decoration>[] => {
  if (spec.type === "mark") {
    return [
      Decoration.mark({
        attributes: spec.attributes,
      }).range(spec.from, spec.to),
    ];
  }
  if (spec.type === "reveal") {
    return [
      Decoration.line({
        attributes: { style: "opacity: 1" },
      }).range(doc.lineAt(spec.from + 1).from),
    ];
  }
  if (spec.type === "collapse") {
    return [
      Decoration.replace({
        widget: new CollapseWidget(spec),
        block: true,
      }).range(spec.from, spec.to),
    ];
  }
  if (spec.type === "title") {
    return [
      Decoration.replace({
        widget: new TitlePageWidget(spec),
        block: true,
      }).range(spec.from, spec.to),
    ];
  }
  if (spec.type === "dialogue") {
    if (spec.grid) {
      return [
        Decoration.replace({
          widget: new DialogueWidget(spec),
          block: true,
        }).range(spec.from, spec.to),
      ];
    } else {
      const blocks = spec.blocks[0];
      if (blocks) {
        return blocks.map((b) =>
          Decoration.line({
            attributes: b.attributes,
          }).range(doc.lineAt(b.from + 1).from)
        );
      }
    }
  }
  if (spec.type === "replace") {
    return [Decoration.replace({}).range(spec.from, spec.to)];
  }
  return [];
};

const decorate = (state: EditorState, from: number = 0, to?: number) => {
  let prevDialogueSpec: DialogueSpec | undefined = undefined;
  const specs: DecorationSpec[] = [];
  const doc = state.doc;

  const isCentered = (nodeRef: SyntaxNodeRef) => {
    const name = nodeRef.name as SparkdownNodeName;
    if (name === "Centered") {
      return true;
    }
    return false;
  };

  const centerRange = (nodeRef: SyntaxNodeRef) => {
    const from = nodeRef.from;
    const to = nodeRef.to;
    specs.push({
      type: "mark",
      from,
      to,
      attributes: {
        style: "display: block; opacity: 1; text-align: center;",
      },
    });
  };

  const isHidden = (nodeRef: SyntaxNodeRef) => {
    const name = nodeRef.name as SparkdownNodeName;
    if (nodeRef.matchContext(["sparkdown"])) {
      return (
        name === "Comment" ||
        name === "LineComment" ||
        name === "BlockComment" ||
        name === "Tag" ||
        name === "Logic" ||
        name === "Knot" ||
        name === "Stitch" ||
        name === "VarDeclaration" ||
        name === "ListDeclaration" ||
        name === "ConstDeclaration" ||
        name === "ExternalDeclaration" ||
        name === "DefineDeclaration" ||
        name === "AudioLine" ||
        name === "ImageLine" ||
        name === "ImageAndAudioLine" ||
        name === "Divert" ||
        name === "Unknown"
      );
    }
    return false;
  };

  const hideRange = (nodeRef: SyntaxNodeRef) => {
    const from = nodeRef.from;
    const to = nodeRef.to;
    const hiddenNodeEndsWithNewline = doc.sliceString(from, to).endsWith("\n");
    const hideFrom = from;
    const hideTo = hiddenNodeEndsWithNewline ? to - 1 : to;
    specs.push({
      type: "collapse",
      from: hideFrom,
      to: hideTo,
    });
    isBlankLineFrom = undefined;
    if (hiddenNodeEndsWithNewline) {
      processNewline(nodeRef.to);
    }
  };

  const processNewline = (to: number) => {
    if (isBlankLineFrom != null) {
      specs.push({
        type: "collapse",
        from: isBlankLineFrom,
        to: to - 1,
        separator: true,
      });
    }
    isBlankLineFrom = to - 1;
  };

  const prevChar = doc.sliceString(from - 1, from);

  let isBlankLineFrom: undefined | number =
    prevChar === "" ? 0 : prevChar === "\n" ? from - 1 : undefined;
  let inDialogue = false;
  let inDualDialogue = false;
  let dialoguePosition = 0;
  let dialogueContent: MarkupContent[] = [];
  let frontMatterPositionContent: Record<string, MarkupContent[]> = {};
  let frontMatterFieldCaptureBlocks: MarkupContent[] = [];
  let frontMatterKeyword = "";

  const tree = syntaxTree(state);
  tree.iterate({
    from,
    to,
    enter: (nodeRef) => {
      const name = nodeRef.name as SparkdownNodeName;
      const from = nodeRef.from;
      const to = nodeRef.to;
      if (name === "Newline") {
        processNewline(nodeRef.to);
      } else if (to > from && name !== "sparkdown" && name !== "Whitespace") {
        isBlankLineFrom = undefined;
      }
      if (name === "FrontMatter") {
        frontMatterPositionContent = {};
      } else if (name === "FrontMatterField") {
        frontMatterFieldCaptureBlocks = [];
        frontMatterKeyword = "";
      } else if (name === "FrontMatterFieldKeyword") {
        const value = doc.sliceString(from, to).trim();
        frontMatterKeyword = value;
        return false;
      } else if (name === "FrontMatterString") {
        const value = doc.sliceString(from, to).trim();
        frontMatterFieldCaptureBlocks.push({
          type: frontMatterKeyword.toLowerCase(),
          from,
          to,
          value,
          markdown: true,
          attributes: {
            style: "min-height: 1em",
          },
        });
        return false;
      } else if (name === "BlockDialogue" || name === "InlineDialogue") {
        inDialogue = true;
        dialoguePosition = 0;
        dialogueContent = [];
      } else if (name === "DialogueCharacter") {
        const value = doc.sliceString(from, to).trim();
        dialogueContent.push({
          type: "character",
          from,
          to,
          value: "@ " + value,
          markdown: true,
          attributes: {
            style: getDialogueLineStyle("character"),
          },
        });
      } else if (name === "DialogueCharacterPositionContent") {
        const value = doc.sliceString(from, to).trim();
        if (value) {
          inDualDialogue = true;
          if (value === "<" || value === "left" || value === "l") {
            dialoguePosition = 1;
          }
          if (value === ">" || value === "right" || value === "r") {
            dialoguePosition = 2;
          }
        } else {
          inDualDialogue = false;
          dialoguePosition = 0;
        }
      } else if (name === "TextChunk") {
        if (inDialogue) {
          const value = doc.sliceString(from, to).trimEnd();
          dialogueContent.push({
            type: "dialogue",
            from,
            to,
            value,
            markdown: true,
            attributes: {
              style: getDialogueLineStyle("dialogue"),
            },
          });
        }
      } else if (name === "ParentheticalLineContent") {
        if (inDialogue) {
          const value = doc.sliceString(from, to).trim();
          dialogueContent.push({
            type: "parenthetical",
            from,
            to,
            value,
            markdown: true,
            attributes: {
              style: getDialogueLineStyle("parenthetical"),
            },
          });
        }
      } else if (isCentered(nodeRef)) {
        centerRange(nodeRef);
        return false;
      } else if (isHidden(nodeRef)) {
        hideRange(nodeRef);
        return false;
      }
      return true;
    },
    leave: (nodeRef) => {
      const name = nodeRef.name as SparkdownNodeName;
      const from = nodeRef.from;
      const to = nodeRef.to;
      if (name === "FrontMatter") {
        // Add FrontMatter Spec
        specs.push({
          type: "title",
          from,
          to,
          language: LANGUAGE_SUPPORT.language,
          highlighter: LANGUAGE_HIGHLIGHTS,
          ...frontMatterPositionContent,
        });
      } else if (name === "FrontMatterField") {
        const firstCaptureBlock = frontMatterFieldCaptureBlocks[0];
        const lastCaptureBlock =
          frontMatterFieldCaptureBlocks[
            frontMatterFieldCaptureBlocks.length - 1
          ];
        if (firstCaptureBlock) {
          firstCaptureBlock.attributes = {
            style: "margin: 1em 0 0 0",
          };
        }
        if (lastCaptureBlock) {
          lastCaptureBlock.attributes = { style: "margin: 0 0 1em 0" };
        }
        const position =
          PAGE_POSITIONS[
            frontMatterKeyword.toLowerCase() as keyof typeof PAGE_POSITIONS
          ];
        if (position) {
          frontMatterPositionContent[position] ??= [];
          frontMatterPositionContent[position]!.push(
            ...frontMatterFieldCaptureBlocks
          );
        }
      } else if (name === "Transition") {
        // Add Transition Spec
        specs.push({
          type: "reveal",
          from,
        });
      } else if (name === "Scene") {
        // Add Scene Spec
        specs.push({
          type: "reveal",
          from,
        });
      } else if (name === "Action") {
        // Add Action Spec
        specs.push({
          type: "reveal",
          from,
        });
      } else if (name === "BlockDialogue" || name === "InlineDialogue") {
        // Add Dialogue Spec
        if (inDualDialogue) {
          const isOdd = dialoguePosition % 2 !== 0;
          if (isOdd) {
            // left (odd position)
            const spec: DialogueSpec = {
              type: "dialogue",
              from,
              to: to - 1,
              language: LANGUAGE_SUPPORT.language,
              highlighter: LANGUAGE_HIGHLIGHTS,
              blocks: [
                dialogueContent.map((c) => {
                  c.attributes = {
                    style: getDualDialogueLineStyle(c.type),
                  };
                  return c;
                }),
              ],
              grid: true,
            };
            specs.push(spec);
            prevDialogueSpec = spec;
          } else if (prevDialogueSpec && prevDialogueSpec.blocks) {
            // right (even position)
            prevDialogueSpec.grid = true;
            prevDialogueSpec.to = to - 1;
            prevDialogueSpec.blocks.push(dialogueContent);
            prevDialogueSpec.blocks.forEach((blocks) => {
              blocks.forEach((block) => {
                block.attributes = {
                  style: getDualDialogueLineStyle(block.type),
                };
              });
            });
          }
        } else {
          const spec: DialogueSpec = {
            type: "dialogue",
            from,
            to,
            language: LANGUAGE_SUPPORT.language,
            highlighter: LANGUAGE_HIGHLIGHTS,
            blocks: [dialogueContent],
            grid: name === "InlineDialogue",
          };
          specs.push(spec);
          prevDialogueSpec = spec;
          dialoguePosition = 0;
        }
        inDialogue = false;
        inDualDialogue = false;
      }
    },
  });
  processNewline(to ?? doc.length + 1);
  return specs.flatMap((b) => createDecorations(b, doc));
};

const replaceDecorations = StateField.define<DecorationSet>({
  create(state) {
    const ranges = decorate(state);
    return ranges.length > 0 ? RangeSet.of(ranges, true) : Decoration.none;
  },
  update(decorations, transaction) {
    const oldTree = syntaxTree(transaction.startState);
    const newTree = syntaxTree(transaction.state);
    if (oldTree != newTree) {
      const cachedCompiler = newTree.prop(cachedCompilerProp);
      const reparsedFrom = cachedCompiler?.reparsedFrom;
      if (reparsedFrom == null) {
        // Remake all decorations from scratch
        const ranges = decorate(transaction.state);
        return ranges.length > 0 ? RangeSet.of(ranges, true) : Decoration.none;
      }
      const add = decorate(transaction.state, reparsedFrom);
      decorations = decorations.update({
        filter: (from: number, to: number) =>
          from < reparsedFrom && to < reparsedFrom,
        add,
        sort: true,
      });
    }
    return decorations;
  },
  provide(field) {
    return EditorView.decorations.from(field);
  },
});

const screenplayFormatting = (): Extension => {
  return [
    LANGUAGE_SUPPORT,
    replaceDecorations,
    syntaxHighlighting(LANGUAGE_HIGHLIGHTS),
  ];
};

export default screenplayFormatting;
