# React Media Renderer

A simple React component that renders an `<img>` or `<video>` element based on the `Content-Type` header of a given URL.

## Installation

```bash
npm install react-media-renderer
```

## Usage

```jsx
import React from 'react';
import MediaRenderer from 'react-media-renderer';

const App = () => {
  return (
    <div>
      <MediaRenderer src="https://example.com/your-media-file.mp4" />
    </div>
  );
};

export default App;
```
