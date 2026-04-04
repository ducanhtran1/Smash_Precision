import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
    constructor() {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }

    async uploadImages(files: Express.Multer.File[]): Promise<string[]> {
        const uploadPromises = files.map(file => {
            return new Promise<string>((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { folder: 'products' }, // It will create a 'products' folder in your Cloudinary dash
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result?.secure_url || ''); // This is the magical URL we want!
                    }
                ).end(file.buffer);
            });
        });

        return Promise.all(uploadPromises);
    }
}
