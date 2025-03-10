import { IImageService } from "../interfaces/IImageService";
import { IImageRepository } from "../../repositories/interfaces/IImageRepository";
import { ImagePageEnum } from "../../enums/ImagePageEnum";
import { ImageResponseDTO } from "../../dto/image/ImageResponseDTO";

export class ImageService implements IImageService {
  constructor(private imageRepository: IImageRepository) {}

  async getImagesByPage(page: ImagePageEnum): Promise<ImageResponseDTO[]> {
    const images: ImageResponseDTO[] = [];

    const domainImages = await this.imageRepository.getImagesByPage(page);

    domainImages.forEach((domainImage) => {
      images.push(ImageResponseDTO.fromImageModel(domainImage));
    });

    return images;
  }
}
