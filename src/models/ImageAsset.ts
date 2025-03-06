import { InvalidModelConstructionException } from "../errors/InvalidModelConstructionException";
import { ImageAssetPage } from "../enums/ImageAssetPage";

export class ImageAsset {
  constructor(
    readonly id: string,
    readonly page: ImageAssetPage,
    readonly name: string,
    readonly url: string,
  ) {}

  static init(data): ImageAsset {
    try {
      return new ImageAsset(data.id, data.page, data.name, data.url);
    } catch {
      throw new InvalidModelConstructionException("ImageAsset");
    }
  }
}
