'use client';

import { useSyncExternalStore, useRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Heading,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  Code,
  RemoveFormat,
  Highlight,
  Alignment,
  BlockQuote,
  CodeBlock,
  HorizontalLine,
  List,
  ListProperties,
  TodoList,
  Link,
  AutoLink,
  Image,
  ImageInsert,
  ImageCaption,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  MediaEmbed,
  Table,
  TableToolbar,
  TableProperties,
  TableCellProperties,
  SpecialCharacters,
  FindAndReplace,
  SelectAll,
  Undo,
  PasteFromOffice,
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const emptySubscribe = () => () => {};
export function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true, // Client
    () => false // Server
  );
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const isMounted = useIsMounted();
  // Khai báo đúng kiểu instance ClassicEditor
  const editorRef = useRef<ClassicEditor | null>(null);

  if (!isMounted) {
    return <div className="min-h-[600px] border rounded-xl bg-slate-50 animate-pulse"></div>;
  }

  return (
    <div className="prose max-w-none w-full">
      {/* Inject CSS nội bộ để ép kích thước CKEditor chuẩn mà không cần sửa file globals.css */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .ck-editor__editable_inline {
            min-height: 600px !important;
            padding: 2rem !important;
            font-size: 1rem !important;
            line-height: 1.75 !important;
          }
          .ck-editor__editable_inline:focus {
            border-color: transparent !important;
            box-shadow: none !important;
            outline: none !important;
          }
        `,
        }}
      />

      <CKEditor
        editor={ClassicEditor}
        data={value}
        onChange={(_event, editor) => {
          const data = editor.getData();
          onChange(data);
        }}
        onReady={(editor) => {
          editorRef.current = editor;
        }}
        config={{
          licenseKey: 'GPL', // Bắt buộc cho bản mã nguồn mở miễn phí
          plugins: [
            Essentials,
            Paragraph,
            Heading,
            Bold,
            Italic,
            Underline,
            Strikethrough,
            Subscript,
            Superscript,
            Code,
            RemoveFormat,
            Highlight,
            Alignment,
            BlockQuote,
            CodeBlock,
            HorizontalLine,
            List,
            ListProperties,
            TodoList,
            Link,
            AutoLink,
            Image,
            ImageInsert,
            ImageCaption,
            ImageResize,
            ImageStyle,
            ImageToolbar,
            MediaEmbed,
            Table,
            TableToolbar,
            TableProperties,
            TableCellProperties,
            SpecialCharacters,
            FindAndReplace,
            SelectAll,
            Undo,
            PasteFromOffice,
          ],
          toolbar: {
            items: [
              'undo',
              'redo',
              '|',
              'heading',
              '|',
              'bold',
              'italic',
              'underline',
              'strikethrough',
              'removeFormat',
              '|',
              'highlight',
              'alignment',
              '|',
              'link',
              'insertImage',
              'mediaEmbed',
              'insertTable',
              '|',
              'bulletedList',
              'numberedList',
              'todoList',
              '|',
              'blockQuote',
              'codeBlock',
              'horizontalLine',
              '|',
              'specialCharacters',
              'findAndReplace',
              'selectAll',
            ],
            shouldNotGroupWhenFull: true,
          },
          placeholder: placeholder || 'Viết nội dung bài viết...',
          heading: {
            options: [
              { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
              {
                model: 'heading2',
                view: 'h2',
                title: 'Heading 2 (H2)',
                class: 'ck-heading_heading2',
              },
              {
                model: 'heading3',
                view: 'h3',
                title: 'Heading 3 (H3)',
                class: 'ck-heading_heading3',
              },
              {
                model: 'heading4',
                view: 'h4',
                title: 'Heading 4 (H4)',
                class: 'ck-heading_heading4',
              },
            ],
          },
          image: {
            insert: { type: 'auto' },
            toolbar: [
              'imageTextAlternative',
              'toggleImageCaption',
              '|',
              'imageStyle:inline',
              'imageStyle:block',
              'imageStyle:side',
            ],
          },
          table: {
            contentToolbar: [
              'tableColumn',
              'tableRow',
              'mergeTableCells',
              '|',
              'tableProperties',
              'tableCellProperties',
            ],
          },
          link: {
            decorators: {
              openInNewTab: {
                mode: 'manual',
                label: 'Mở link ở tab mới (Chuẩn SEO)',
                attributes: {
                  target: '_blank',
                  rel: 'noopener noreferrer',
                },
              },
            },
          },
        }}
      />
    </div>
  );
}
