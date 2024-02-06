export default {
    s3: {
        endpoint: 'http://localhost:4566', // LocalStack S3 endpoint
        s3ForcePathStyle: true, // Needed for LocalStack
        accessKeyId: 'fake', // Fake credentials
        secretAccessKey: 'fake', // Fake credentials
        bucket: 'your-bucket-name' // Replace with your bucket name
},
    mongodb: {
        uri: 'mongodb://localhost:27017/backend_test' // Local MongoDB URI
    }
}
