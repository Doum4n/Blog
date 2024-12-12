import React, { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const Editor = forwardRef(
  ({ readOnly, defaultValue, onTextChange, onSelectionChange, onSubmit, content, post_id }, ref) => {
    const containerRef = useRef(null);
    const defaultValueRef = useRef(defaultValue);
    const onTextChangeRef = useRef(onTextChange);
    const onSelectionChangeRef = useRef(onSelectionChange);

    const [imageUrls, setImageUrls] = useState([]); // Keep track of uploaded image URLs
    const [htmlContent, setHtmlContent] = useState('');

    const imageHandler = async () => {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      input.click();

      input.onchange = async () => {
        if (input.files && input.files[0]) {
          const file = input.files[0];
          const formData = new FormData();
          formData.append('image', file);

          try {
            const response = await fetch('http://0.0.0.0/image/temp', {
              method: 'POST',
              body: formData,
            });
            const data = await response.json();

            if (data.path) {
              const imgUrl = `http://0.0.0.0/storage/${data.path}`;
              setImageUrls((prev) => [...prev, data.path]); // Add to list of URLs
              const range = ref.current.getSelection();
              ref.current.insertEmbed(range.index, 'image', imgUrl);
            }
          } catch (error) {
            console.error('Image upload error:', error);
          }
        }
      };
    };

    const storeImage = async (url) => {
      try {
        const response = await fetch('http://0.0.0.0/image/store', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            post_id: post_id,
            path: url,
          }),
        });
        const data = await response.json();
        console.log('Image stored successfully:', data);
      } catch (error) {
        console.error('Image store error:', error);
      }
    };

    useEffect(() => {
      if (onSubmit) {
        imageUrls.forEach((url) => storeImage(url));
      }
    }, [onSubmit, imageUrls]);

    useEffect(() => {
      if (htmlContent) content(htmlContent);
    }, [htmlContent, content]);

    useLayoutEffect(() => {
      onTextChangeRef.current = onTextChange;
      onSelectionChangeRef.current = onSelectionChange;
    });

    useEffect(() => {
      ref.current?.enable(!readOnly);
    }, [readOnly]);

    useEffect(() => {
      const container = containerRef.current;
      const editorContainer = container.appendChild(
        container.ownerDocument.createElement('div'),
      );
      const quill = new Quill(editorContainer, {
        modules: {
          toolbar: {
            container: [
              [{ 'header' : [1, 2, 3, false] }],
              [{ 'font': [] }],
              // [{ 'size': ['small', false, 'large', 'huge'] }],
              ['bold', 'italic', 'underline'],
              [{'color' : []}, {'background' : []}],
              [{ 'align': [] }],
              [{ 'indent': '-1'}, { 'indent': '+1' }],
              [{'list' : 'ordered'}],
              [{'list' : 'bullet'}],
              ['image', 'video', 'link'],
              ['clean']
            ],
            handlers: {
              image: imageHandler,
            },
          },
        },
        placeholder: 'Compose an epic...',
        theme: 'snow',
      });

      ref.current = quill;

      if (defaultValue) {
        quill.setContents(defaultValueRef.current);
        quill.root.innerHTML = defaultValue;
      }

      quill.on(Quill.events.TEXT_CHANGE, (...args) => {
        onTextChangeRef.current?.(...args);
        const html = quill.root.innerHTML;
        setHtmlContent(html);
      });

      quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
        onSelectionChangeRef.current?.(...args);
      });

      return () => {
        ref.current = null;
        container.innerHTML = '';
      };
    }, [ref]);

    return (
      <div>
        <div ref={containerRef}></div>
        {htmlContent}
      </div>
    );
  },
);

Editor.displayName = 'Editor';

export default Editor;
