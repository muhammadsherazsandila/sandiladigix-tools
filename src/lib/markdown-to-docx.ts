import { marked, type Token, type Tokens } from "marked";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
} from "docx";
import { saveAs } from "file-saver";

// ─── Parse Marked tokens into docx Paragraphs ─────────────────

interface ParseContext {
  listLevel: number;
  isOrdered: boolean;
  orderIndex: number;
}

// Plain options object that mirrors TextRun constructor params
interface TextRunOptions {
  text?: string;
  font?: string;
  size?: number;
  bold?: boolean;
  italics?: boolean;
  color?: string;
  underline?: { type: string };
  shading?: { fill: string; type: string; color: string };
  break?: number;
}

/**
 * Recursively parse inline tokens into plain option objects.
 * We avoid creating TextRun instances here so that parent tokens
 * (strong, em) can compose options via object spread.
 */
function parseInlineToOptions(tokens: Token[]): TextRunOptions[] {
  const opts: TextRunOptions[] = [];

  for (const token of tokens) {
    switch (token.type) {
      case "text":
        opts.push({ text: token.text, font: "Calibri", size: 22 });
        break;
      case "strong":
        if (token.tokens) {
          for (const child of parseInlineToOptions(token.tokens)) {
            opts.push({ ...child, bold: true });
          }
        }
        break;
      case "em":
        if (token.tokens) {
          for (const child of parseInlineToOptions(token.tokens)) {
            opts.push({ ...child, italics: true });
          }
        }
        break;
      case "codespan":
        opts.push({
          text: token.text,
          font: "Consolas",
          size: 20,
          color: "6d5dfc",
          shading: { fill: "f0f0f5", type: "clear", color: "auto" },
        });
        break;
      case "link":
        opts.push({
          text: token.text,
          font: "Calibri",
          size: 22,
          color: "6d5dfc",
          underline: { type: "single" },
        });
        break;
      case "br":
        opts.push({ break: 1 });
        break;
      default:
        if ("text" in token && typeof token.text === "string") {
          opts.push({ text: token.text, font: "Calibri", size: 22 });
        }
        break;
    }
  }

  return opts;
}

/** Convert inline marked tokens into an array of TextRun instances */
function parseInlineTokens(tokens: Token[]): TextRun[] {
  return parseInlineToOptions(tokens).map(
    (opts) => new TextRun(opts as ConstructorParameters<typeof TextRun>[0])
  );
}

function getHeadingLevel(depth: number): (typeof HeadingLevel)[keyof typeof HeadingLevel] {
  const map: Record<number, (typeof HeadingLevel)[keyof typeof HeadingLevel]> = {
    1: HeadingLevel.HEADING_1,
    2: HeadingLevel.HEADING_2,
    3: HeadingLevel.HEADING_3,
    4: HeadingLevel.HEADING_4,
    5: HeadingLevel.HEADING_5,
    6: HeadingLevel.HEADING_6,
  };
  return map[depth] || HeadingLevel.HEADING_6;
}

function tokensToParagraphs(
  tokens: Token[],
  ctx: ParseContext = { listLevel: 0, isOrdered: false, orderIndex: 1 }
): (Paragraph | Table)[] {
  const elements: (Paragraph | Table)[] = [];

  for (const token of tokens) {
    switch (token.type) {
      case "heading": {
        const headingToken = token as Tokens.Heading;
        const headingSize = [52, 40, 32, 28, 24, 22][headingToken.depth - 1] || 22;
        elements.push(
          new Paragraph({
            heading: getHeadingLevel(headingToken.depth),
            spacing: { before: 240, after: 120 },
            children: headingToken.tokens
              ? parseInlineToOptions(headingToken.tokens).map(
                  (opts) =>
                    new TextRun({
                      ...opts,
                      bold: true,
                      font: "Calibri",
                      size: headingSize,
                      color: "1a1a2e",
                    } as ConstructorParameters<typeof TextRun>[0])
                )
              : [
                  new TextRun({
                    text: headingToken.text,
                    bold: true,
                    font: "Calibri",
                    size: headingSize,
                    color: "1a1a2e",
                  }),
                ],
          })
        );
        break;
      }

      case "paragraph": {
        const paraToken = token as Tokens.Paragraph;
        elements.push(
          new Paragraph({
            spacing: { after: 120 },
            children: paraToken.tokens
              ? parseInlineTokens(paraToken.tokens)
              : [new TextRun({ text: paraToken.text, font: "Calibri", size: 22 })],
          })
        );
        break;
      }

      case "list": {
        const listToken = token as Tokens.List;
        let idx = 1;
        for (const item of listToken.items) {
          const bullet = listToken.ordered ? `${idx}. ` : "• ";
          const itemRuns: TextRun[] = [
            new TextRun({
              text: bullet,
              font: "Calibri",
              size: 22,
              bold: listToken.ordered,
            }),
          ];

          // extract text from item tokens
          if (item.tokens) {
            for (const childToken of item.tokens) {
              if (childToken.type === "text" && "tokens" in childToken && childToken.tokens) {
                itemRuns.push(...parseInlineTokens(childToken.tokens as Token[]));
              } else if (childToken.type === "text") {
                itemRuns.push(
                  new TextRun({
                    text: (childToken as Tokens.Text).text,
                    font: "Calibri",
                    size: 22,
                  })
                );
              }
            }
          }

          elements.push(
            new Paragraph({
              spacing: { after: 60 },
              indent: { left: 360 * (ctx.listLevel + 1) },
              children: itemRuns,
            })
          );
          idx++;
        }
        break;
      }

      case "code": {
        const codeToken = token as Tokens.Code;
        const lines = codeToken.text.split("\n");
        for (const line of lines) {
          elements.push(
            new Paragraph({
              spacing: { after: 40 },
              shading: { fill: "f5f5f5", type: "clear", color: "auto" },
              indent: { left: 200 },
              children: [
                new TextRun({
                  text: line || " ",
                  font: "Consolas",
                  size: 18,
                  color: "333333",
                }),
              ],
            })
          );
        }
        break;
      }

      case "blockquote": {
        const bqToken = token as Tokens.Blockquote;
        if (bqToken.tokens) {
          for (const child of tokensToParagraphs(bqToken.tokens, ctx)) {
            if (child instanceof Paragraph) {
              elements.push(
                new Paragraph({
                  spacing: { after: 80 },
                  indent: { left: 400 },
                  border: {
                    left: { style: BorderStyle.SINGLE, size: 6, color: "6d5dfc", space: 10 },
                  },
                  children: [
                    new TextRun({
                      text:
                        (child as unknown as { children?: { text?: string }[] }).children?.[0]
                          ?.text || "",
                      font: "Calibri",
                      size: 22,
                      italics: true,
                      color: "666666",
                    }),
                  ],
                })
              );
            }
          }
        }
        break;
      }

      case "table": {
        const tableToken = token as Tokens.Table;
        const rows: TableRow[] = [];

        // Header row
        rows.push(
          new TableRow({
            children: tableToken.header.map(
              (cell: Tokens.TableCell) =>
                new TableCell({
                  width: { size: 100 / tableToken.header.length, type: WidthType.PERCENTAGE },
                  shading: { fill: "6d5dfc", type: "clear", color: "auto" },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: cell.text,
                          bold: true,
                          font: "Calibri",
                          size: 20,
                          color: "ffffff",
                        }),
                      ],
                    }),
                  ],
                })
            ),
          })
        );

        // Data rows
        for (const row of tableToken.rows) {
          rows.push(
            new TableRow({
              children: row.map(
                (cell: Tokens.TableCell) =>
                  new TableCell({
                    width: { size: 100 / tableToken.header.length, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: cell.text,
                            font: "Calibri",
                            size: 20,
                          }),
                        ],
                      }),
                    ],
                  })
              ),
            })
          );
        }

        elements.push(
          new Table({
            rows,
            width: { size: 100, type: WidthType.PERCENTAGE },
          })
        );
        elements.push(new Paragraph({ spacing: { after: 120 }, children: [] }));
        break;
      }

      case "hr":
        elements.push(
          new Paragraph({
            spacing: { before: 200, after: 200 },
            border: {
              bottom: { style: BorderStyle.SINGLE, size: 1, color: "cccccc", space: 1 },
            },
            children: [],
          })
        );
        break;

      case "space":
        elements.push(new Paragraph({ spacing: { after: 120 }, children: [] }));
        break;

      default:
        if ("text" in token && typeof token.text === "string") {
          elements.push(
            new Paragraph({
              spacing: { after: 120 },
              children: [new TextRun({ text: token.text, font: "Calibri", size: 22 })],
            })
          );
        }
        break;
    }
  }

  return elements;
}

// ─── Public Export ─────────────────────────────────────────────

export async function convertMarkdownToDocx(markdown: string, filename: string = "document") {
  const tokens = marked.lexer(markdown);
  const paragraphs = tokensToParagraphs(tokens);

  const doc = new Document({
    creator: "SandilaDigiX Tools",
    title: filename,
    description: "Generated by SandilaDigiX Markdown to Word Converter",
    styles: {
      default: {
        document: {
          run: {
            font: "Calibri",
            size: 22,
            color: "333333",
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: paragraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${filename}.docx`);
}
