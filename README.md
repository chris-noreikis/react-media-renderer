# React Media Renderer

A small, simple, dependency-free React component that conditionally renders an image or video when the source can be either format and the type is unknown until runtime.

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

Choose how to detect whether src is an image or a video.  The default method is to inspect the `fileExtension`.  Use `contentTypeHeader` to perform a `HEAD` request to the media server and inspect the Content-Type HTTP Header.  Your media server must support HEAD requests.

```jsx
import MediaRenderer from 'react-media-renderer';

const App = () => {
    return (
        <div>
            <MediaRenderer
                src="https://example.com/your-media-file.mp4"
                detectionStrategy="fileExtension"
            />
            <MediaRenderer
                src="https://example.com/your-image-file.png"
                detectionStrategy="contentTypeHeader"
            />
        </div>
    );
};

export default App;
```

### Prop Forwarding

Arbitrary `React.HTMLAttributes` are forwarded to the underlying `<img>` or `<video>` element. `imageProps` are forwarded specifically to the `<img>` element, while `videoProps` are forwarded to the `<video>` element.


```jsx
import MediaRenderer from 'react-media-renderer';

const App = () => {
    return (
        <div>
            <MediaRenderer
                src="https://example.com/your-media-file.mp4"
                id="your-media-file"
                videoProps={{ controls: true, autoPlay: true }}
                imageProps={{ alt: 'My Cool Image' }}
            />
        </div>
    );
};

export default App;
```

### Render Props

Declaratively render a custom image or video component instead of an `<img>` or `<video>` tag by providing render props.

Any props provided to `MediaRenderer` are forwarded to the render prop.

```jsx
import MediaRenderer from 'react-media-renderer';

const App = () => {
    return (
        <div>
            <MediaRenderer
                src="https://example.com/your-media-file.mp4"
                className="my-media"
                renderImage={props => <img {...props.imageProps} src={props.src} className={props.className} />}
                renderVideo={props => <video {...props.videoProps} src={props.src} className={props.className} controls />}
            />
        </div>
    );
};

export default App;
```
