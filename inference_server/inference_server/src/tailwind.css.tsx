import React from 'react';

const TailwindCSS = () => (
  <>
    <script
      dangerouslySetInnerHTML={{
        __html: `
          tailwind.config = {
            content: [],
            theme: {
              extend: {
                fontFamily: {
                  figtree: ['Figtree', 'sans-serif'],
                  font_awesome_6_pro: ['Font Awesome 6 Pro'],
                  font_awesome_6_duotone: ['Font Awesome 6 Duotone'],
                  font_awesome_6_brands: ['Font Awesome 6 Brands'],
                },
              },
            },
          };
        `,
      }}
    />
    <style>{`
      @font-face {
        /* This font could not be included automatically because of legal reasons. Please add it manually or switch to another font */
        font-family: 'Font Awesome 6 Brands';
        font-weight: 400;
        font-style: normal;
      }
      @font-face {
        /* This font could not be included automatically because of legal reasons. Please add it manually or switch to another font */
        font-family: 'Font Awesome 6 Duotone';
        font-weight: 900;
        font-style: normal;
      }
      @font-face {
        /* This font could not be included automatically because of legal reasons. Please add it manually or switch to another font */
        font-family: 'Font Awesome 6 Pro';
        font-weight: 900;
        font-style: normal;
      }
      @font-face {
        /* This font could not be included automatically because of legal reasons. Please add it manually or switch to another font */
        font-family: 'Font Awesome 5 Brands';
        font-weight: 400;
        font-style: normal;
      }
      @font-face {
        /* This font could not be included automatically because of legal reasons. Please add it manually or switch to another font */
        font-family: 'Font Awesome 5 Pro';
        font-weight: 900;
        font-style: normal;
      }
      @font-face {
        /* This font could not be included automatically because of legal reasons. Please add it manually or switch to another font */
        font-family: 'Font Awesome 5 Duotone';
        font-weight: 900;
        font-style: normal;
      }
      @font-face {
        /* This font could not be included automatically because of legal reasons. Please add it manually or switch to another font */
        font-family: 'FontAwesome';
        font-weight: normal;
        font-style: normal;
      }
      @font-face {
        /* This font could not be included automatically because of legal reasons. Please add it manually or switch to another font */
        font-family: 'FontAwesome';
        font-weight: normal;
        font-style: normal;
      }
      @font-face {
        font-family: 'Figtree';
        src: url('https://fonts.gstatic.com/s/figtree/v8/_Xmu-HUzqDCFdgfMm4GND65o.woff2') format("woff2");
        font-weight: 300 900;
        font-style: italic;
      }
      @font-face {
        font-family: 'Figtree';
        src: url('https://fonts.gstatic.com/s/figtree/v8/_Xms-HUzqDCFdgfMm4S9DQ.woff2') format("woff2");
        font-weight: 300 900;
        font-style: normal;
      }
    `}</style>
  </>
);

export default TailwindCSS;
