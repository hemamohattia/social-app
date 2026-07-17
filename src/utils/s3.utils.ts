import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const s3Config = () => new S3Client({
    region: process.env.AWS_REGION as string,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
});

export const uploadFile = async (file: Express.Multer.File, path = 'general') => {
    const key = `${process.env.APPLICATION_NAME}/${path}/${Date.now()}-${file.originalname}`;
    const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME as string,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
    });
    await s3Config().send(command);
    return key;
};

export const deleteFile = async (key: string) => {
    const command = new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME as string,
        Key: key,
    });
    return await s3Config().send(command);
};

export const getSignedFileUrl = async (key: string, expiresIn = 3600) => {
    const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME as string,
        Key: key,
    });
    return await getSignedUrl(s3Config(), command, { expiresIn });
};