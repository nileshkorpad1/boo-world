import mongoose, { Schema, Document } from 'mongoose';
import aws from 'aws-sdk';
import fs from 'fs';
import config from '../config/index'

const s3 = new aws.S3({
 endpoint: config.s3.endpoint,
  s3ForcePathStyle: config.s3.s3ForcePathStyle,
  accessKeyId: config.s3.accessKeyId,
  secretAccessKey: config.s3.secretAccessKey
});

export interface IProfile extends Document {
    name: string;
    email: string;
    imageUrl: string;
    description: string;
}

const profileSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true }
});

// Pre-save hook to upload image to fake S3
profileSchema.pre<IProfile>('save', async function(next) {
    const profile = this;

    // Check if image has been modified
    if (!profile.isModified('imageUrl')) {
        return next();
    }

    try {
        // Read image file from local filesystem
        const imageFile = fs.readFileSync(profile.imageUrl);

        // Upload image to fake S3 bucket
        await s3.upload({
            Bucket: config.s3.bucket, // Replace with your bucket name
            Key: `${profile.id}.jpg`, // Use profile ID as the key
            Body: imageFile,
            ACL: 'public-read', // Make uploaded image publicly accessible
            ContentType: 'image/jpeg' // Specify image content type
        }).promise();

        // Set image URL to S3 URL
        profile.imageUrl = `${config.s3.endpoint}/${config.s3.bucket}/${profile.id}.jpg`; // Replace with your bucket name

        // Continue with saving the profile
        next();
    } catch (err:any) {
        console.error('Error uploading image to S3:', err);
        next(err);
    }
});

const Profile = mongoose.model<IProfile>('Profile', profileSchema);

export default Profile;
