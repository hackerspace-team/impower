export enum Type {
  Document = 1,

  // Markdown Block
  FencedCode,
  BulletList,
  OrderedList,
  ListItem,
  HTMLBlock,
  Paragraph,
  CommentBlock,
  ProcessingInstructionBlock,
  SignificantWhitespace,

  // Spark Block
  Synopsis,
  Section,
  SectionName,
  SectionOpenMark,
  SectionSeparatorMark,
  SectionParameter,
  SectionVariableName,
  SectionParameterName,
  SectionParameterColon,
  SectionParameterType,
  SectionParameterOperator,
  SectionParameterValue,
  SectionCloseMark,
  SectionColonMark,
  SectionReturnType,
  Title,
  Scene,
  ScenePrefix,
  SceneLocation,
  SceneTime,
  Transition,
  Character,
  CharacterName,
  Action,
  Centered,
  Jump,
  Repeat,
  Return,
  Import,
  ImportValue,
  Struct,
  StructList,
  StructName,
  StructColon,
  StructOperator,
  StructBase,
  StructField,
  StructFieldName,
  StructFieldAccess,
  StructFieldValue,
  Variable,
  VariableName,
  VariableColon,
  VariableType,
  VariableOperator,
  VariableValue,
  Assign,
  AssignName,
  CallName,
  AssignOperator,
  AssignValue,
  Call,
  CallSeparatorMark,
  CallValue,
  CallEntityName,
  Compare,
  Choice,
  ChoiceSectionName,
  Condition,
  ConditionCheck,
  ConditionValue,
  JumpSectionName,
  JumpSeparatorMark,
  JumpValue,
  ReturnValue,
  PageBreak,
  PossibleCharacterName,
  PossibleCharacter,
  PossibleSection,
  PossibleLogic,
  Interpolation,
  InterpolationVariableName,

  // Markdown Inline
  Escape,
  HardBreak,
  Emphasis,
  StrongEmphasis,
  InlineCode,
  HTMLTag,
  Comment,
  ProcessingInstruction,
  URL,

  // Spark Inline
  ImageNote,
  AudioNote,
  DynamicTag,
  CharacterParenthetical,
  ParentheticalLine,
  Display,
  Dialogue,
  DialogueLine,
  Lyric,
  Underline,
  SceneNumber,
  Spaces,
  Pause,

  // Keywords
  Number,
  String,
  Boolean,

  // Markdown Mark
  SectionMark,
  QuoteMark,
  ListMark,
  LinkMark,
  EmphasisMark,
  CodeMark,
  CodeText,
  CodeInfo,
  LinkTitle,
  LinkLabel,

  // Spark Mark
  ImageNoteMark,
  AudioNoteMark,
  DynamicTagMark,
  SynopsisMark,
  SceneMark,
  SceneSeparatorMark,
  SceneNumberMark,
  CharacterMark,
  CharacterDual,
  ActionMark,
  TitleEntry,
  TitleMark,
  CenteredMark,
  LyricMark,
  UnderlineMark,
  ImportMark,
  VariableMark,
  VariableKeyword,
  StructMark,
  StructOpenMark,
  StructCloseMark,
  JumpMark,
  JumpOpenMark,
  JumpCloseMark,
  RepeatMark,
  ReturnMark,
  AssignMark,
  ChoiceMark,
  CallMark,
  ConditionMark,
  CallOpenMark,
  CallCloseMark,
  ChoiceColonMark,
  ChoiceOpenMark,
  ChoiceCloseMark,
  ChoiceGoMark,
  ConditionColonMark,
  PossibleSectionMark,
  InterpolationOpenMark,
  InterpolationCloseMark,
}
