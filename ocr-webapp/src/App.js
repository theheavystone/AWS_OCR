import React from 'react';
import OCRUploader from './OCRUploader';
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';

Amplify.configure(awsExports);

function App() {
  return (
    <div className="App">
      <OCRUploader />
    </div>
  );
}

export default App;
