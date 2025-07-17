# React Media Renderer

A small, simple, dependency-free, React Component that conditionally renders an image or video when src can be either and is unknown until runtime. 

## Installation

```bash
npm install react-media-renderer
```

## Basic Usage

```jsx
import React from 'react';
import MediaRenderer from 'react-media-renderer';

const App = () => {
  return (
      <MediaRenderer src="https://example.com/your-media-file.mp4" />
  );
};

export default App;
```

### Detection Strategy

Choose how video/images are detected.  The default method is to inspect the file extension.  Use 
