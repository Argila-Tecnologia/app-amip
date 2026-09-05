import { useCallback } from 'react';

import { useNavigation } from '@react-navigation/native';

import { useQuery } from '@tanstack/react-query';

import { useTheme } from 'styled-components/native';

import { Feather } from '@expo/vector-icons';

import { api } from '@services/api';

import { IMuseumDTO } from '@dtos/museum-dto';

import { HeaderApp } from '@components/HeaderApp';
import { Loading } from '@components/Loading';

import {
  Divider,
  MuseumButton,
  MuseumDescription,
  MuseumHeader,
  MuseumHeaderTitle,
  MuseumHeaderTitleContainer,
  MuseumImage,
  MuseumItemContent,
  MuseumList,
  MuseumsContainer,
  MuseumsContent,
  MuseumsEmptyContainer,
  MuseumsEmptyInfo,
} from './styles';

export function MuseumsScreen() {
  const navigation = useNavigation();
  const theme = useTheme();

  // FUNCTIONS
  const handleDetailsMuseum = useCallback(
    (museumId: string) => {
      navigation.navigate('detailsMuseumScreen', { museumId });
    },
    [navigation],
  );
  // END FUNCTIONS

  // USE QUERY
  const { data: museums, isLoading: isLoadingMuseums } = useQuery<
    IMuseumDTO[] | undefined
  >({
    queryKey: ['museums'],
    queryFn: async () => {
      const response = await api.get('/museums');

      if (response.status === 200) {
        const museumsData = response.data as IMuseumDTO[];

        return museumsData;
      }
    },
  });
  // END USE QUERY

  return (
    <MuseumsContainer>
      <HeaderApp />

      {isLoadingMuseums ? (
        <Loading />
      ) : (
        <MuseumsContent>
          <MuseumList
            contentContainerStyle={
              !museums || (museums && museums.length === 0) ? { flex: 1 } : {}
            }
            showsVerticalScrollIndicator={false}
            data={museums}
            keyExtractor={(museumItem) => museumItem.id}
            ItemSeparatorComponent={() => <Divider />}
            renderItem={({ item: museumItem }) => (
              <MuseumButton onPress={() => handleDetailsMuseum(museumItem.id)}>
                <MuseumHeader>
                  <MuseumHeaderTitleContainer>
                    <MuseumHeaderTitle>{museumItem.title}</MuseumHeaderTitle>
                  </MuseumHeaderTitleContainer>
                </MuseumHeader>

                <MuseumItemContent>
                  {/*
                    Antes só aparecia se "image_url" existisse. Agora
                    sempre mostra algo (placeholder da AMIP se não houver
                    imagem, ou se ela falhar ao carregar).
                  */}
                  <MuseumImage
                    source={{ uri: museumItem.image_url }}
                    contentFit="cover"
                  />

                  <MuseumDescription numberOfLines={3} ellipsizeMode="tail">
                    {museumItem.description}
                  </MuseumDescription>

                  <Feather
                    name="chevron-right"
                    size={25}
                    color={theme.COLORS['text-secondary']}
                  />
                </MuseumItemContent>
              </MuseumButton>
            )}
            ListEmptyComponent={() => (
              <MuseumsEmptyContainer>
                <MuseumsEmptyInfo>
                  Ainda não estamos com nenhuma galeria.
                </MuseumsEmptyInfo>
              </MuseumsEmptyContainer>
            )}
          />
        </MuseumsContent>
      )}
    </MuseumsContainer>
  );
}
