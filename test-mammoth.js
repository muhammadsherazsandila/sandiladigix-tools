const { marked } = require("marked");
const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require("docx");
const mammoth = require("mammoth");

async function run() {
  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun({ text: "Hello, Welcome!", size: 52 })]
        }),
        new Paragraph({
          children: [new TextRun({ text: "Paragraph text" })]
        })
      ]
    }]
  });

  const buffer = await Packer.toBuffer(doc);
  const result = await mammoth.convertToHtml({ buffer });
  console.log("HTML:", result.value);
}
run();
