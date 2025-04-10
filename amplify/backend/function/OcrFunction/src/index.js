console.log('🌈 NEW OCR Lambda triggered:', JSON.stringify(event, null, 2));

const AWS = require('aws-sdk');

// 创建 Textract 客户端（默认使用当前 Region）
const textract = new AWS.Textract();

exports.handler = async (event) => {
  console.log('📥 Lambda triggered with event:', JSON.stringify(event, null, 2));

  // 支持 Amplify 直接传 bucket 和 key
  const bucket = event.bucket;
  const key = event.key;

  if (!bucket || !key) {
    console.error('❌ Missing bucket or key');
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing bucket or key' }),
    };
  }

  const params = {
    Document: {
      S3Object: {
        Bucket: bucket,
        Name: key,
      },
    },
  };

  try {
    const response = await textract.detectDocumentText(params);

    console.log('🧠 Textract response:', JSON.stringify(response, null, 2));

    // 提取所有文字（支持 LINE 和 WORD）
    const textBlocks = response.Blocks
      .filter(
        (block) =>
          (block.BlockType === 'LINE' || block.BlockType === 'WORD') &&
          block.Text
      )
      .map((block) => block.Text);

    const combinedText = textBlocks.join(' ');

    return {
      statusCode: 200,
      body: JSON.stringify({ extractedText: combinedText }),
    };
  } catch (err) {
    console.error('❌ Textract OCR failed:', err);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Textract OCR failed',
        message: err.message,
      }),
    };
  }
};
