CKEDITOR.stylesSet.add( 'my_styles', [
    // Block-level styles
    { name: 'Heading 1', element: 'h1', styles: { 'color': 'Blue' } },
    { name: 'Heading 2' , element: 'h2', styles: { 'color': 'Red' } },

    // Object styles
    { name: 'image', element: 'img', styles: { 'color': 'Blue' } },
    { name: 'link' , element: 'a', styles: { 'color': 'Red' } },

    // Inline styles
    { name: 'CSS Style', element: 'span', attributes: { 'class': 'my_style' } },
    { name: 'Marker: Yellow', element: 'span', styles: { 'background-color': 'Yellow' } }
] );