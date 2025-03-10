import { ImagePageEnum } from "../../enums/ImagePageEnum";
import { ImageResponseDTO } from "../../dto/image/ImageResponseDTO";

export interface IImageService {
  getImagesByPage(page: ImagePageEnum): Promise<ImageResponseDTO[]>;
}
