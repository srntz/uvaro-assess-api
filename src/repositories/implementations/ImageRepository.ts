import { Repository } from "../base/Repository";
import { IImageRepository } from "../interfaces/IImageRepository";
import { ImagePageEnum } from "../../enums/ImagePageEnum";
import { Image } from "../../models/Image";
import { image } from "../../db/schemas/image";
import { eq } from "drizzle-orm";

export class ImageRepository extends Repository implements IImageRepository {
  constructor() {
    super();
  }

  async getImagesByPage(page: ImagePageEnum): Promise<Image[]> {
    const images: Image[] = [];

    const data: (typeof image.$inferSelect)[] = await this.db
      .select()
      .from(image)
      .where(eq(image.image_page, page));

    data.forEach((item) => {
      images.push(Image.fromDatabase(item));
    });

    return images;
  }
}
