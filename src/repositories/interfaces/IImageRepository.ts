import { ImagePageEnum } from "../../enums/ImagePageEnum";
import { Image } from "../../models/Image";

export interface IImageRepository {
  getImagesByPage(page: ImagePageEnum): Promise<Image[]>;
}
