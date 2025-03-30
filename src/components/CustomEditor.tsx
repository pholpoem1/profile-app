import React, { useEffect, useMemo, useState } from "react";
import { CKEditor, useCKEditorCloud } from "@ckeditor/ckeditor5-react";
// import { EditorConfig } from "ckeditor5";
import { CONFIG } from "@/libs/config";
import {
  ClassicEditor,
  Alignment,
  AutoLink,
  Autosave,
  BlockQuote,
  Bold,
  Bookmark,
  Code,
  CodeBlock,
  Essentials,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  GeneralHtmlSupport,
  Heading,
  Highlight,
  HorizontalLine,
  Indent,
  IndentBlock,
  Italic,
  Link,
  Paragraph,
  RemoveFormat,
  Strikethrough,
  Style,
  Subscript,
  Superscript,
  Underline,
  EditorConfig
} from "ckeditor5";

const LICENSE_KEY = CONFIG.ckeditorKey;

const CustomEditor = ({ isLayoutReady }: { isLayoutReady: boolean }) => {
  if (!isLayoutReady) {
    return null;
  }

  return (
    <CKEditor
      editor={ClassicEditor}
      data={"<p>Hello world!</p>"}
      config={{
        toolbar: {
          items: [
            "heading",
            "style",
            "|",
            "fontSize",
            "fontFamily",
            "fontColor",
            "fontBackgroundColor",
            "|",
            "bold",
            "italic",
            "underline",
            "strikethrough",
            "subscript",
            "superscript",
            "code",
            "removeFormat",
            "|",
            "horizontalLine",
            "link",
            "bookmark",
            "highlight",
            "blockQuote",
            "codeBlock",
            "|",
            "alignment",
            "|",
            "outdent",
            "indent"
          ],
          shouldNotGroupWhenFull: false
        },
        plugins: [
          Alignment,
          AutoLink,
          Autosave,
          BlockQuote,
          Bold,
          Bookmark,
          Code,
          CodeBlock,
          Essentials,
          FontBackgroundColor,
          FontColor,
          FontFamily,
          FontSize,
          GeneralHtmlSupport,
          Heading,
          Highlight,
          HorizontalLine,
          Indent,
          IndentBlock,
          Italic,
          Link,
          Paragraph,
          RemoveFormat,
          Strikethrough,
          Style,
          Subscript,
          Superscript,
          Underline
        ],
        fontFamily: {
          supportAllValues: true
        },
        fontSize: {
          options: [10, 12, 14, "default", 18, 20, 22],
          supportAllValues: true
        },
        heading: {
          options: [
            {
              model: "paragraph",
              title: "Paragraph",
              class: "ck-heading_paragraph"
            },
            {
              model: "heading1",
              view: "h1",
              title: "Heading 1",
              class: "ck-heading_heading1"
            },
            {
              model: "heading2",
              view: "h2",
              title: "Heading 2",
              class: "ck-heading_heading2"
            },
            {
              model: "heading3",
              view: "h3",
              title: "Heading 3",
              class: "ck-heading_heading3"
            },
            {
              model: "heading4",
              view: "h4",
              title: "Heading 4",
              class: "ck-heading_heading4"
            },
            {
              model: "heading5",
              view: "h5",
              title: "Heading 5",
              class: "ck-heading_heading5"
            },
            {
              model: "heading6",
              view: "h6",
              title: "Heading 6",
              class: "ck-heading_heading6"
            }
          ]
        },
        htmlSupport: {
          allow: [
            {
              name: /^.*$/,
              styles: true,
              attributes: true,
              classes: true
            }
          ]
        },
        initialData: "Hello",
        licenseKey: LICENSE_KEY,
        link: {
          addTargetToExternalLinks: true,
          defaultProtocol: "https://",
          decorators: {
            toggleDownloadable: {
              mode: "manual",
              label: "Downloadable",
              attributes: {
                download: "file"
              }
            }
          }
        },
        placeholder: "Type or paste your content here!",
        style: {
          definitions: [
            {
              name: "Article category",
              element: "h3",
              classes: ["category"]
            },
            {
              name: "Title",
              element: "h2",
              classes: ["document-title"]
            },
            {
              name: "Subtitle",
              element: "h3",
              classes: ["document-subtitle"]
            },
            {
              name: "Info box",
              element: "p",
              classes: ["info-box"]
            },
            {
              name: "Side quote",
              element: "blockquote",
              classes: ["side-quote"]
            },
            {
              name: "Marker",
              element: "span",
              classes: ["marker"]
            },
            {
              name: "Spoiler",
              element: "span",
              classes: ["spoiler"]
            },
            {
              name: "Code (dark)",
              element: "pre",
              classes: ["fancy-code", "fancy-code-dark"]
            },
            {
              name: "Code (bright)",
              element: "pre",
              classes: ["fancy-code", "fancy-code-bright"]
            }
          ]
        }
      }}
    />
  );
};

export default CustomEditor;
