/* eslint-disable no-continue */
import { htmlReplacements } from "../constants/htmlReplacements";
import { FountainSyntaxTree, FountainToken } from "../types/FountainSyntaxTree";
import { fountainLexer } from "./fountainLexer";

export const generateFountainHtml = (
  syntaxTree: FountainSyntaxTree
): {
  scriptHtml?: string;
  titleHtml?: string;
} => {
  const html = [];
  const titleHtml = [];
  // Generate html for title page
  if (syntaxTree.titleTokens) {
    const sections = Object.keys(syntaxTree.titleTokens);
    for (let i = 0; i < sections.length; i += 1) {
      const section = sections[i];
      if (!syntaxTree.titleTokens) {
        syntaxTree.titleTokens = {};
      }
      const titlePageTokens = syntaxTree.titleTokens[section];
      if (titlePageTokens) {
        titlePageTokens.sort((a, b) => {
          if (a.order == null) {
            return 0;
          }
          return a.order - b.order;
        });
      }
      titleHtml.push(`<div class="title-page-section" data-line="${section}">`);
      let currentIndex = 0; /* , previous_type = null */
      while (titlePageTokens && currentIndex < titlePageTokens.length) {
        const currentToken: FountainToken = titlePageTokens[currentIndex];
        if (currentToken.ignore) {
          currentIndex += 1;
          continue;
        }
        if (currentToken.text !== "") {
          const html = fountainLexer(
            currentToken.text,
            undefined,
            htmlReplacements,
            true
          );
          if (html !== undefined) {
            currentToken.html = html;
          }
        }
        switch (currentToken.type) {
          case "title":
            titleHtml.push(
              `<h1 class="source title-page-token" id="line_${currentToken.line}">${currentToken.html}</h1>`
            );
            break;
          default:
            titleHtml.push(
              `<p class="${currentToken.type} source title-page-token" id="line_${currentToken.line}">${currentToken.html}</p>`
            );
            break;
        }
        currentIndex += 1;
      }
      titleHtml.push(`</div>`);
    }
  }

  // Generate html for script
  let currentIndex = 0;
  let isAction = false;
  while (currentIndex < syntaxTree.scriptTokens.length) {
    const currentToken: FountainToken = syntaxTree.scriptTokens[currentIndex];
    if (currentToken.text !== "") {
      const html = fountainLexer(
        currentToken.text,
        currentToken.type,
        htmlReplacements
      );
      if (html !== undefined) {
        currentToken.html = html;
      }
    } else {
      currentToken.html = "";
    }

    if (
      (currentToken.type === "action" || currentToken.type === "centered") &&
      !currentToken.ignore
    ) {
      let classes = "source";

      let elStart = "\n";
      if (!isAction) elStart = "<p>"; // first action element
      if (currentToken.type === "centered") {
        if (isAction) elStart = ""; // It's centered anyway, no need to add anything
        classes += " centered";
      }
      html.push(
        `${elStart}<span class="${classes}" id="line_${currentToken.line}">${currentToken.html}</span>`
      );

      isAction = true;
    } else if (currentToken.type === "separator" && isAction) {
      if (currentIndex + 1 < syntaxTree.scriptTokens.length - 1) {
        // we're not at the end
        const next_type = syntaxTree.scriptTokens[currentIndex + 1].type;
        if (
          next_type === "action" ||
          next_type === "separator" ||
          next_type === "centered"
        ) {
          html.push("\n");
        }
      } else if (isAction) {
        // we're at the end
        html.push("</p>");
      }
    } else {
      if (isAction) {
        // no longer, close the paragraph
        isAction = false;
        html.push("</p>");
      }
      switch (currentToken.type) {
        case "scene_heading":
          html.push(
            `<h3 class="source" ${
              currentToken.scene ? `id="line_${currentToken.line}"` : ""
            } data-scene="${currentToken.scene}" data-line="${
              currentToken.line
            }">${currentToken.html}</h3>`
          );
          break;
        case "transition":
          html.push(
            `<h2 class="source" id="line_${currentToken.line}">${currentToken.text}</h2>`
          );
          break;

        case "dual_dialogue_begin":
          html.push('<div class="dual-dialogue">');
          break;

        case "dialogue_begin":
          html.push(
            `<div class="dialogue${
              currentToken.dual ? ` ${currentToken.dual}` : ""
            }">`
          );
          break;

        case "character":
          if (currentToken.dual === "left") {
            html.push('<div class="dialogue left">');
          } else if (currentToken.dual === "right") {
            html.push('</div><div class="dialogue right">');
          }

          html.push(
            `<h4 class="source" id="line_${currentToken.line}">${currentToken.text}</h4>`
          );

          break;
        case "parenthetical":
          html.push(
            `<p class="source parenthetical" id="line_${currentToken.line}" >${currentToken.html}</p>`
          );
          break;
        case "dialogue":
          if (currentToken.text === "  ") html.push("<br>");
          else
            html.push(
              `<p class="source" id="line_${currentToken.line}">${currentToken.html}</p>`
            );
          break;
        case "dialogue_end":
          html.push("</div> ");
          break;
        case "dual_dialogue_end":
          html.push("</div></div> ");
          break;

        case "section":
          html.push(
            `<p class="source section" id="line_${currentToken.line}" data-line="${currentToken.line}" data-level="${currentToken.level}">${currentToken.text}</p>`
          );
          break;
        case "synopsis":
          html.push(
            `<p class="source synopsis" id="line_${currentToken.line}" >${currentToken.html}</p>`
          );
          break;
        case "lyric":
          html.push(
            `<p class="source lyric" id="line_${currentToken.line}">${currentToken.html}</p>`
          );
          break;

        case "note":
          html.push(
            `<p class="source note" id="line_${currentToken.line}">${currentToken.html}</p>`
          );
          break;
        case "boneyard_begin":
          html.push("<!-- ");
          break;
        case "boneyard_end":
          html.push(" -->");
          break;

        case "page_break":
          html.push("<hr />");
          break;
        /* case 'separator':
                         html.push('<br />');
                         break; */
        default:
          break;
      }
    }
    currentIndex += 1;
  }
  const result: { scriptHtml?: string; titleHtml?: string } = {};
  if (html && html.length > 0) {
    const scriptHtmlString = html.join("");
    if (scriptHtmlString) {
      result.scriptHtml = scriptHtmlString;
    }
  }
  if (titleHtml && titleHtml.length > 0) {
    const titleHtmlString = titleHtml.join("");
    if (titleHtmlString) {
      result.titleHtml = titleHtmlString;
    }
  }
  return result;
};