import React from 'react';
import MediaRenderer from '../src/index';

function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>React Media Renderer - Development Demo</h1>
      <div style={{ marginBottom: '30px' }}>
        <h2>Different Media Sources</h2>

        <h3>Image Example</h3>
        <div
          style={{
            border: '1px solid #ccc',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '10px',
          }}
        >
          <MediaRenderer
            src="https://placehold.co/300x200"
            alt="Placeholder image"
            style={{ border: '2px solid #007bff', borderRadius: '8px' }}
            className="demo-image"
          />
        </div>

        <h3>Video Example</h3>
        <div
          style={{
            border: '1px solid #ccc',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '10px',
          }}
        >
          <MediaRenderer
            src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            controls
            autoPlay
            muted
            loop
            style={{ width: '100%', maxWidth: '500px', borderRadius: '8px' }}
            className="demo-video"
          />
        </div>
      </div>
    </div>
  );
}

export default App;
