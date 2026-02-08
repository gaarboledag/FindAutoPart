import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StorageService {
    private s3Client: S3Client;
    private bucketName: string;
    private readonly logger = new Logger(StorageService.name);

    constructor(private configService: ConfigService) {
        const accountId = this.configService.get<string>('R2_ACCOUNT_ID');
        const accessKeyId = this.configService.get<string>('R2_ACCESS_KEY_ID');
        const secretAccessKey = this.configService.get<string>('R2_SECRET_ACCESS_KEY');
        this.bucketName = this.configService.get<string>('R2_BUCKET_NAME') || 'findpart';

        if (!accountId || !accessKeyId || !secretAccessKey) {
            this.logger.warn('R2 credentials not fully configured');
        }

        this.s3Client = new S3Client({
            region: 'auto',
            endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: accessKeyId || '',
                secretAccessKey: secretAccessKey || '',
            },
        });
    }

    async generatePresignedUrl(filename: string, contentType: string) {
        const key = `cotizaciones/${uuidv4()}-${filename}`;

        const putCommand = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            ContentType: contentType,
        });

        try {
            const uploadUrl = await getSignedUrl(this.s3Client, putCommand, { expiresIn: 3600 });

            // Generate a signed GET URL for immediate preview (valid for 7 days)
            // This allows the frontend to display the image even if the bucket is private
            const getCommand = new GetObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            });

            const publicUrl = await getSignedUrl(this.s3Client, getCommand, { expiresIn: 604800 });

            return { uploadUrl, publicUrl, key };
        } catch (error) {
            this.logger.error('Error generating presigned URL', error);
            throw error;
        }
    }

    async signUrl(key: string) {
        try {
            const command = new GetObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            });
            // Valid for 1 hour
            return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
        } catch (error) {
            this.logger.error(`Error signing URL for key ${key}`, error);
            return null;
        }
    }
}
