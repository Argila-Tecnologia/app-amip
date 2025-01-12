import { IImagesMuseumDTO } from './image-museum-dto';

interface IImageGallery {
  id: string;
  url: string;
}

export type IMuseumDTO = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  images_museum: IImagesMuseumDTO[];
  gallery_images: IImageGallery[];
};
