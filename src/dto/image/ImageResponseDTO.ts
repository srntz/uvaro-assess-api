import { ImagePageEnum } from "../../enums/ImagePageEnum";
import { Image } from "../../models/Image";

export class ImageResponseDTO {
  readonly name: string;
  readonly page: ImagePageEnum;
  readonly url: string;

  constructor(data: ImageResponseDTO) {
    this.name = data.name;
    this.page = data.page;
    this.url = data.url;
  }

  static fromImageModel(image: Image) {
    return new ImageResponseDTO({
      name: image.image_name,
      page: image.image_page,
      url: image.image_url,
    });
  }
}
