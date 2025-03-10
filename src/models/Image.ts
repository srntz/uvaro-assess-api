import { InvalidModelConstructionException } from "../errors/InvalidModelConstructionException";
import { ImagePageEnum } from "../enums/ImagePageEnum";
import { image } from "../db/schemas/image";

export class Image {
  constructor(
    readonly image_id: string,
    readonly image_page: ImagePageEnum,
    readonly image_name: string,
    readonly image_url: string,
  ) {}

  static fromDatabase(data: typeof image.$inferSelect): Image {
    try {
      return new Image(
        data.image_id,
        this.mapPostgresEnumToDomain(data.image_page),
        data.image_name,
        data.image_url,
      );
    } catch {
      throw new InvalidModelConstructionException("ImageAsset");
    }
  }

  private static mapPostgresEnumToDomain(page: string) {
    switch (page) {
      case "HOME":
        return ImagePageEnum.HOME;
      case "DASHBOARD":
        return ImagePageEnum.DASHBOARD;
      default:
        throw new Error("Enum mapping failed.");
    }
  }
}
