import React, { useState } from 'react';
import { uploadData } from 'aws-amplify/storage';
import { post } from 'aws-amplify/api';
import awsExports from './aws-exports';

const OCRUploader = () => {
  const [file, setFile] = useState(null);
  const [ocrText, setOcrText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setOcrText('');
  };

  const handleUploadAndOCR = async () => {
    if (!file) return;

    setLoading(true);
    const fileName = `${Date.now()}-${file.name}`;

    try {
      // ✅ Step 1: 上传图片到 S3
      const { result } = await uploadData({
        key: fileName,
        data: file,
        options: {
          accessLevel: 'public',
          contentType: file.type,
        },
      });

      console.log('✅ 上传成功：', result);

      // ✅ Step 2: 调用 OCR Lambda API
      const { data } = await post({
        apiName: 'ocrGateway',
        path: '/ocr',
        options: {
          body: {
            bucket: awsExports.aws_user_files_s3_bucket,
            key: fileName,
          },
        },
      });

      console.log('🔍 OCR Response:', data);
      setOcrText(data?.body?.extractedText || 'No text found.');

    } catch (err) {
      console.error('❌ OCR 出错：', err);
      setOcrText('OCR failed: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>📄 AWS Textract OCR Demo</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUploadAndOCR} disabled={!file || loading}>
        {loading ? '识别中...' : '上传并识别'}
      </button>
      <pre style={{ whiteSpace: 'pre-wrap', marginTop: '20px' }}>{ocrText}</pre>
    </div>
  );
};

export default OCRUploader;
