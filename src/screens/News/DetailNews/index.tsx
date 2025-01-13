import { useCallback } from 'react';

import { Linking, ScrollView } from 'react-native';

import { useRoute } from '@react-navigation/native';

import Toast from 'react-native-toast-message';

import { useQuery } from '@tanstack/react-query';

import { api } from '@services/api';

import { INewsDTO } from '@dtos/news-dto';

import { Loading } from '@components/Loading';
import { Header } from '@components/Header';

import {
  BoxNews,
  DetailNewsLinkVideoButton,
  DetailNewsLinkVideoButtonText,
  DetailsNewsContainer,
  DetailsNewsContent,
  DetailsNewsTitle,
  ImageNews,
} from './styles';

type IDetailNewsRouteParams = {
  newsId: string;
};

export function DetailsNewsScreen() {
  const route = useRoute();

  const { newsId } = route.params as IDetailNewsRouteParams;

  // FUNCTIONS
  const handlePressLinkVideo = useCallback(async (video: string) => {
    try {
      const canOpenVideo = await Linking.canOpenURL(video);

      if (canOpenVideo) {
        Linking.openURL(video);
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text2: 'Não foi possível abrir o vídeo.',
      });
    }
  }, []);
  // END FUNCTIONS

  // USE QUERY
  const { data: news, isLoading: isLoadingNews } = useQuery<
    INewsDTO | undefined
  >({
    queryKey: ['detailNews', newsId],
    queryFn: async () => {
      const response = await api.get(`news/show/${newsId}`);

      if (response.status === 200) {
        const detailsNewsData = response.data as INewsDTO;

        return detailsNewsData;
      }
    },
  });
  // END USE QUERY

  return (
    <DetailsNewsContainer>
      <Header title="Notícias" />

      {isLoadingNews ? (
        <Loading />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {news && (
            <DetailsNewsContent>
              <DetailsNewsTitle>{news.title}</DetailsNewsTitle>

              <BoxNews>
                {news.image_url && (
                  <ImageNews
                    source={{ uri: news.image_url }}
                    contentFit="cover"
                  />
                )}
              </BoxNews>

              <DetailNewsLinkVideoButton
                onPress={() => {
                  handlePressLinkVideo(news.video);
                }}
              >
                <DetailNewsLinkVideoButtonText>
                  Veja mais detalhes da matéria neste link!
                </DetailNewsLinkVideoButtonText>
              </DetailNewsLinkVideoButton>
            </DetailsNewsContent>
          )}
        </ScrollView>
      )}
    </DetailsNewsContainer>
  );
}
