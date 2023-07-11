/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { v2 } from 'cloudinary';

@Injectable()
export class CloudinaryService {
    async convertImagesCloudinary(images: string[]): Promise<string[]> {
        const uploadPromises = images.map((image) =>
            new Promise<string>((resolve, reject) => {
                v2.uploader.upload(image, { upload_preset: 'n8a057sj' }, (error, result) => {
                    if (result) {
                        console.log(result.url);
                        resolve(result.url);
                    } else {
                        reject(error);
                    }
                });
            })
        );

        try {
            const uploadedUrls = await Promise.all(uploadPromises);
            return uploadedUrls;
        } catch (error) {
            // Handle the error appropriately
            console.log(error);
            throw new Error('Failed to upload images to Cloudinary');
        }
    }
}
