import { useCallback } from 'react';

import { useNavigation } from '@react-navigation/native';

import { Feather } from '@expo/vector-icons';

import { useTheme } from 'styled-components/native';

import { useQuery } from '@tanstack/react-query';

import { api } from '@services/api';

import { INewsDTO } from '@dtos/news-dto';

import { HeaderApp } from '@components/HeaderApp';
import { Loading } from '@components/Loading';

import {
  NewsButton,
  NewsContainer,
  NewsContent,
  NewsDescription,
  NewsEmptyContainer,
  NewsEmptyInfo,
  NewsHeader,
  NewsHeaderTitle,
  NewsHeaderTitleContainer,
  NewsImage,
  NewsItem,
  NewsList,
} from './styles';

export function NewsScreen() {
  const theme = useTheme();
  const navigation = useNavigation();

  // FUNCTIONS
  const handleDetailNews = useCallback(
    (newsId: string) => {
      navigation.navigate('detailsNewsScreen', { newsId });
    },
    [navigation],
  );
  // END FUNCTIONS

  // USE QUERY
  const { data: news, isLoading: isLoadingNews } = useQuery<
    INewsDTO[] | undefined
  >({
    queryKey: ['news'],
    queryFn: async () => {
      const response = await api.get('/news');

      if (response.status === 200) {
        const newsData = response.data as INewsDTO[];

        return newsData;
      }
    },
  });
  // END USE QUERY

  return (
    <NewsContainer>
      <HeaderApp />

      <NewsContent>
        {isLoadingNews ? (
          <Loading />
        ) : (
          <NewsList
            contentContainerStyle={news?.length === 0 ? { flex: 1 } : {}}
            data={news}
            keyExtractor={(item) => item.id}
            renderItem={({ item: newsItem }) => (
              <NewsButton
                onPress={() => {
                  handleDetailNews(newsItem.id);
                }}
              >
                <NewsHeader>
                  <NewsHeaderTitleContainer>
                    <NewsHeaderTitle>{newsItem.title}</NewsHeaderTitle>
                  </NewsHeaderTitleContainer>

                  <Feather
                    name="chevron-right"
                    size={25}
                    color={theme.COLORS['black-color']}
                  />
                </NewsHeader>

                <NewsItem>
                  {newsItem.image_url && (
                    <NewsImage source={{ uri: newsItem.image_url }} />
                  )}

                  <NewsDescription numberOfLines={3} ellipsizeMode="tail">
                    {newsItem.content}
                  </NewsDescription>
                </NewsItem>
              </NewsButton>
            )}
            ListEmptyComponent={() => (
              <NewsEmptyContainer>
                <NewsEmptyInfo>
                  Nenhum notícia encontrada.{'\n'}Em breve estaremos com
                  notícias quentinhas para vocês
                </NewsEmptyInfo>
              </NewsEmptyContainer>
            )}
          />
        )}
      </NewsContent>
    </NewsContainer>
  );
}
