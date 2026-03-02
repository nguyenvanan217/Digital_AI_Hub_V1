import { RequestHandler } from 'express';
import { extname } from 'path';
import { sendResponse } from 'src/utils/responseHandler';
import sharp from 'sharp';

export const uploadFileController: RequestHandler = async (req, res) => {
    try {
        if (!req.file) throw new Error('Không có file để upload');

        const MAX_SIZE = 5 * 1024 * 1024; // 5MB
        let finalBuffer = req.file.buffer;

        // Nếu ảnh gốc vượt quá 5MB thì nén lại
        if (finalBuffer.length > MAX_SIZE) {
            finalBuffer = await sharp(finalBuffer).jpeg({ quality: 80 }).toBuffer();

            // Kiểm tra lại sau khi nén
            if (finalBuffer.length > MAX_SIZE) {
                throw new Error('File sau khi nén vẫn vượt quá kích thước cho phép (5MB)');
            }
        }

        const bucketName = process.env.MINIO_BUCKET!;
        const fileExt = extname(req.file.originalname);
        const objectName = `${uuidv4()}${fileExt}`;

        const exists = await minioClient.bucketExists(bucketName);
        if (!exists) {
            await minioClient.makeBucket(bucketName, 'us-east-1');
        }

        await minioClient.putObject(bucketName, objectName, finalBuffer);

        const fileUrl = `${process.env.MINIO_URL}/${bucketName}/${objectName}`;

        sendResponse(res, 200, {
            success: true,
            message: 'Upload file thành công',
            data: fileUrl,
        });
    } catch (error) {
        sendResponse(res, 400, {
            success: false,
            message: 'Upload file thất bại',
            error: (error as Error).message,
        });
    }
};
