/* Amplify Params - DO NOT EDIT
	AUTH_OCRWEBAPP817D4DCF_USERPOOLID
	ENV
	REGION
	STORAGE_OCRIMAGESTORAGE_BUCKETNAME
Amplify Params - DO NOT EDIT */const AWS = require('aws-sdk');
const textract = new AWS.Textract();

exports.handler = async (event) => {
    console.log("EVENT:", JSON.stringify(event));

    const bucket = event.bucket;
    const key = event.key;

    const params = {
        Document: {
            S3Object: {
                Bucket: bucket,
                Name: key
            }
        }
    };

    try {
        const response = await textract.detectDocumentText(params);

        const lines = response.Blocks
            .filter(block => block.BlockType === 'LINE')
            .map(block => block.Text);

        return {
            statusCode: 200,
            body: JSON.stringify({ extractedText: lines.join('\n') }),
        };
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Textract OCR failed' }),
        };
    }
};
