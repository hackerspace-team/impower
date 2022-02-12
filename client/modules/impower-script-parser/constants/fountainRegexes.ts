export const fountainRegexes = {
  title_page:
    /(title|credit|author[s]?|source|notes|draft date|date|watermark|contact( info)?|revision|copyright|font|tl|tc|tr|cc|br|bl):.*/i,

  section: /^[ \t]*(#+)(?: *)(.*)/,
  synopsis: /^[ \t]*(?:=(?!=+) *)(.*)/,

  scene_heading:
    /^[ \t]*([.](?![.])|(?:[*]{0,3}_?)(?:int|ext|est|int[.]?\/ext|i[.]?\/e)[. ])(.+?)(#[-.0-9a-z]+#)?$/i,
  scene_number: /#(.+)#/,

  transition:
    /^[ \t]*((?:FADE (?:TO BLACK|OUT)|CUT TO BLACK)\.|.+ TO:|^TO:$)|^(?:> *)(.+)/,

  dialogue:
    /^[ \t]*([*_]+[^\p{Ll}\p{Lo}\p{So}\r\n]*)(\^?)?(?:\n(?!\n+))([\s\S]+)/u,

  character:
    /^[ \t]*(?![#!]|(\[\[)|(SUPERIMPOSE:))(((?!@)[^\p{Ll}\r\n]*?\p{Lu}[^\p{Ll}\r\n]*?)|((@)[^\r\n]*?))(\(.*\))?(\s*\^)?$/u,
  parenthetical: /^[ \t]*(\(.+\))$/,

  action: /^(.+)/g,
  centered: /^[ \t]*(?:> *)(.+)(?: *<)(\n.+)*/g,

  page_break: /^={3,}(.*)$/,
  line_break: /^ {2}$/,

  note_inline: /(?:\[{2}(?!\[+))([\s\S]+?)(?:\]{2}(?!\[+)) ?/g,

  emphasis: /(_|\*{1,3}|_\*{1,3}|\*{1,3}_)(.+)(_|\*{1,3}|_\*{1,3}|\*{1,3}_)/g,
  bold_italic_underline:
    /(_{1}\*{3}(?=.+\*{3}_{1})|\*{3}_{1}(?=.+_{1}\*{3}))(.+?)(\*{3}_{1}|_{1}\*{3})/g,
  bold_underline:
    /(_{1}\*{2}(?=.+\*{2}_{1})|\*{2}_{1}(?=.+_{1}\*{2}))(.+?)(\*{2}_{1}|_{1}\*{2})/g,
  italic_underline:
    /(?:_{1}\*{1}(?=.+\*{1}_{1})|\*{1}_{1}(?=.+_{1}\*{1}))(.+?)(\*{1}_{1}|_{1}\*{1})/g,
  bold_italic: /(\*{3}(?=.+\*{3}))(.+?)(\*{3})/g,
  bold: /(\*{2}(?=.+\*{2}))(.+?)(\*{2})/g,
  italic: /(\*{1}(?=.+\*{1}))(.+?)(\*{1})/g,
  underline: /(_{1}(?=.+_{1}))(.+?)(_{1})/g,

  lyric: /^(~.+)/g,

  link: /(\[?(\[)([^\][]*\[?[^\][]*\]?[^\][]*)(\])(\()(.+?)(?:\s+(["'])(.*?)\4)?(\)))/g,
};