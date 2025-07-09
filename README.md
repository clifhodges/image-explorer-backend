# Image Explorer Backend

## Getting Started

First, run the development server:

```bash
npm i && npm start
```

Then run the React App found at [text](https://github.com/clifhodges/image-explorer)

This server will run at [http://localhost:8000](http://localhost:8000) by default.

After starting React App, open browser at [http://localhost:3000](http://localhost:3000) to see the result.

## Approximate Time to Complete

4 hours

## Possible Future Improvements and Additions

- There's some slight layout shifting going on when changing the Image list.
- Add an Image preview modal.
- Set up an S3 bucket with Cloudfront CDN for image caching.
- Fix icons. They turn dark with the image when hovering the image.
- Add a full screen drag-and-drop feature to allow uploading images this way.
- Create a unified material UI theme.
- Break some of the larger components into smaller ones.
- Implement file upload limits.
- Improve filename sanitization rules.
- Create a Button component which wraps the MUI Button.
