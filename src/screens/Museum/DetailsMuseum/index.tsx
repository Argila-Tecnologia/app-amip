import React, { useState } from 'react';

import { ScrollView } from 'react-native';

import { useRoute } from '@react-navigation/native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  ImageGallery,
  ImageObject,
} from '@georstat/react-native-image-gallery';

import { useQuery } from '@tanstack/react-query';

import { api } from '@services/api';

import { IMuseumDTO } from '@dtos/museum-dto';

import { Header } from '../../../components/Header';
import { Loading } from '@components/Loading';
import { Button } from '@components/Form/Button';
import { HeaderImageGallery } from '@components/HeaderImageGallery';
import { FooterImageGallery } from '@components/FooterImageGallery';

import {
  DetailMuseumContainer,
  DetailMuseumContent,
  DetailMuseumGalleryImages,
  DetailMuseumImage,
  DetailMuseumImageContainer,
  DetailMuseumItemMuseum,
  DetailMuseumMuseumDescription,
  DetailMuseumTitle,
} from './styles';

type IDetailsMuseumRouteParams = {
  museumId: string;
};

export function DetailsMuseumScreen() {
  const [isCustomGalleryOpen, setIsCustomGalleryOpen] = useState(false);

  const route = useRoute();
  const insets = useSafeAreaInsets();

  const { museumId } = route.params as IDetailsMuseumRouteParams;

  const paddingBottom = insets.bottom;

  const openCustomGallery = () => setIsCustomGalleryOpen(true);
  const closeCustomGallery = () => setIsCustomGalleryOpen(false);

  // USE QUERY
  const { data: museum, isLoading: isLoadingDetailMuseum } = useQuery<
    IMuseumDTO | undefined
  >({
    queryKey: ['detailsMuseum', museumId],
    queryFn: async () => {
      const response = await api.get(`/museums/show/${museumId}`);

      if (response.status === 200) {
        const museum = response.data as IMuseumDTO;

        const museumFormatted: IMuseumDTO = {
          ...museum,
          gallery_images: museum.images_museum.map((img) => {
            return { id: img.id, url: img.image_url };
          }),
        };

        return museumFormatted;
      }
    },
  });
  // END USE QUERY

  return (
    <DetailMuseumContainer>
      <Header title="Museu" />

      {isLoadingDetailMuseum ? (
        <Loading />
      ) : (
        <ScrollView
          style={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {museum && (
            <DetailMuseumContent>
              <DetailMuseumTitle>{museum.title}</DetailMuseumTitle>

              <DetailMuseumItemMuseum>
                {museum.image_url && (
                  <DetailMuseumImageContainer>
                    <DetailMuseumImage
                      source={{ uri: museum.image_url }}
                      contentFit="cover"
                    />
                  </DetailMuseumImageContainer>
                )}

                <DetailMuseumMuseumDescription>
                  {museum.description}
                </DetailMuseumMuseumDescription>

                <DetailMuseumGalleryImages style={{ paddingBottom }}>
                  {museum.gallery_images &&
                    museum.gallery_images.length > 0 && (
                      <>
                        <Button onPress={openCustomGallery}>
                          Visualizar galeria
                        </Button>

                        <ImageGallery
                          close={closeCustomGallery}
                          hideThumbs
                          images={museum.gallery_images}
                          isOpen={isCustomGalleryOpen}
                          renderHeaderComponent={(
                            item: ImageObject,
                            currentIndex: number,
                          ) => (
                            <HeaderImageGallery
                              currentIndex={currentIndex}
                              onCloseGalleryButton={closeCustomGallery}
                            />
                          )}
                          renderFooterComponent={(
                            _image: ImageObject,
                            currentIndex: number,
                          ) => (
                            <FooterImageGallery
                              total={museum.gallery_images?.length}
                              currentIndex={currentIndex}
                            />
                          )}
                          resizeMode="contain"
                        />
                      </>
                    )}
                </DetailMuseumGalleryImages>
              </DetailMuseumItemMuseum>
            </DetailMuseumContent>
          )}
        </ScrollView>
      )}
    </DetailMuseumContainer>
  );
}
