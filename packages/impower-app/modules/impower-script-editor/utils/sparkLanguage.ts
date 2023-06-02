/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  defineLanguageFacet,
  foldNodeProp,
  indentNodeProp,
  Language,
  languageDataProp,
  LanguageDescription,
  ParseContext,
} from "@codemirror/language";
import { styleTags, tags as t } from "@lezer/highlight";
import { MarkdownParser } from "../classes/MarkdownParser";
import { GFM, Subscript, Superscript } from "../constants/extension";
import { parser as baseParser } from "../constants/parser";
import { Type } from "../types/type";

export const tags = {
  titleKey: t.attributeName,
  titleValue: t.attributeValue,
  section: t.heading,
  sectionName: t.labelName,
  scene: t.propertyName,
  sceneNumber: t.number,
  transition: t.unit,
  variableName: t.variableName,
  parameterName: t.function(t.variableName),
  dialogue_character: t.className,
  dialogue_parenthetical: t.tagName,
  dialogue: t.name,
  dualDialogue: t.typeOperator,
  lyric: t.annotation,
  pageBreak: t.contentSeparator,
  note: t.meta,
  synopsis: t.lineComment,
  centered: t.quote,
  underline: t.link,
  emphasis: t.emphasis,
  strong: t.strong,
  strongEmphasis: t.strong,
  conditionCheck: t.logicOperator,
  comment: t.comment,
  commentBlock: t.comment,
  escape: t.escape,
  structName: t.character,
  structBase: t.special(t.character),
  structFieldName: t.special(t.propertyName),
  link: t.link,
  image: t.link,
  orderedList: t.list,
  bulletList: t.list,
  inlineCode: t.monospace,
  codeText: t.monospace,
  url: t.url,
  paragraph: t.content,
  hardBreak: t.processingInstruction,
  pause: t.punctuation,

  sectionMark: t.heading1,
  sceneMark: t.heading2,
  lyricMark: t.processingInstruction,
  noteMark: t.standard(t.meta),
  synopsisMark: t.standard(t.lineComment),
  centeredMark: t.processingInstruction,
  emphasisMark: t.processingInstruction,
  underlineMark: t.processingInstruction,
  quoteMark: t.processingInstruction,
  linkMark: t.processingInstruction,
  strikethrough: t.strikethrough,
  formatting: t.processingInstruction,
  codeMark: t.special(t.processingInstruction),

  typeName: t.typeName,
  keyword: t.keyword,
  string: t.string,
  number: t.number,
  boolean: t.bool,

  invalid: t.invalid,
};

const data = defineLanguageFacet({ block: { open: "<!--", close: "-->" } });

const commonmark = baseParser.configure({
  props: [
    styleTags({
      "Comment/...": tags.comment,
      "Title/...": tags.titleValue,
      "TitleMark": tags.titleKey,
      "Scene/...": tags.scene,
      "SceneMark ": tags.sceneMark,
      "SceneNumber/...": tags.sceneNumber,
      "Transition/...": tags.transition,
      "Parameter": tags.parameterName,
      "Character/...": tags.dialogue_character,
      "PossibleCharacter/...": tags.dialogue_character,
      "Parenthetical/... CharacterParenthetical ParentheticalLine":
        tags.dialogue_parenthetical,
      "CharacterDual": tags.dualDialogue,
      "Dialogue/...": tags.dialogue,
      "Lyric/...": tags.lyric,
      "LyricMark": tags.lyricMark,
      "ConditionCheck": tags.conditionCheck,
      "SectionMark PossibleSectionMark": tags.sectionMark,
      "SectionName": tags.section,
      "Synopsis": tags.synopsis,
      "SynopsisMark": tags.synopsisMark,
      "ImageNote AudioNote DynamicTag": tags.note,
      "Centered/...": tags.centered,
      "CenteredMark": tags.centeredMark,
      "Underline/...": tags.underline,
      "UnderlineMark": tags.underlineMark,
      "Emphasis/...": tags.emphasis,
      "EmphasisMark": tags.emphasisMark,
      "StrongEmphasis/...": tags.strongEmphasis,
      "OrderedList/...": tags.orderedList,
      "PageBreak/...": tags.pageBreak,

      "Comment": tags.comment,
      "CommentBlock": tags.commentBlock,
      "Escape": tags.escape,
      "URL": tags.url,
      "Link/...": tags.link,
      "LinkMark": tags.linkMark,
      "Image/...": tags.image,
      "InlineCode": tags.inlineCode,
      "CodeText": tags.codeText,
      "CodeMark": tags.codeMark,
      "HardBreak": tags.hardBreak,
      "QuoteMark": tags.quoteMark,
      "Paragraph": tags.paragraph,
      "Strikethrough/...": tags.strikethrough,
      "Pause": tags.pause,

      "SectionVariableName VariableName AssignName InterpolationVariableName":
        tags.variableName,
      "StructName": tags.structName,
      "StructBase": tags.structBase,
      "StructFieldName": tags.structFieldName,
      "StructFieldAccess": tags.variableName,
      "JumpSectionName ChoiceSectionName CallName": tags.sectionName,
      "SectionParameterName": tags.parameterName,
      "StructMark StructType ListMark ConditionMark CallMark AssignMark ChoiceMark VariableMark VariableKeyword JumpMark ChoiceJumpMark RepeatMark ReturnMark InterpolationOpenMark InterpolationCloseMark ImageNoteMark AudioNoteMark DynamicTagMark ImportMark TransitionMark JumpMark":
        tags.keyword,
      "VariableType SectionParameterType SectionReturnType": tags.typeName,
      "String": tags.string,
      "Number": tags.number,
      "Boolean": tags.boolean,
    }),
    foldNodeProp.add((type) => {
      if (
        type.id !== Type.Section &&
        type.id !== Type.Title &&
        type.id !== Type.Struct
      ) {
        return undefined;
      }
      return (tree, state) => ({
        from: state.doc.lineAt(tree.from).to,
        to: tree.to,
      });
    }),
    indentNodeProp.add({
      Document: () => null,
    }),
    languageDataProp.add({
      Document: data,
    }),
  ],
});

export function mkLang(parser: MarkdownParser): Language {
  return new Language(data, parser);
}

/// Language support for strict CommonMark.
export const commonmarkLanguage = mkLang(commonmark);

const extended = commonmark.configure([
  GFM,
  Subscript,
  Superscript,
  {
    props: [
      styleTags({
        "TableDelimiter SubscriptMark SuperscriptMark StrikethroughMark":
          t.processingInstruction,
        "TableHeader/...": t.heading,
        "Strikethrough/...": t.strikethrough,
        "TaskMarker": t.atom,
        "Task": t.list,
        "Emoji": t.character,
        "Subscript Superscript": t.special(t.content),
        "TableCell": t.content,
      }),
    ],
  },
]);

/// Language support for [GFM](https://github.github.com/gfm/) plus
/// subscript, superscript, and emoji syntax.
export const sparkLanguage = mkLang(extended);

export function getCodeParser(
  languages: readonly LanguageDescription[],
  defaultLanguage?: Language
) {
  return (info: string) => {
    const found =
      info && LanguageDescription.matchLanguageName(languages, info, true);
    if (!found) return defaultLanguage ? defaultLanguage.parser : null;
    if (found.support) return found.support.language.parser;
    return ParseContext.getSkippingParser(found.load());
  };
}