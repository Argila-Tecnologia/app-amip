import { useCallback } from 'react';

import { useNavigation } from '@react-navigation/native';

import { Feather } from '@expo/vector-icons';

import { useTheme } from 'styled-components/native';

import { useQuery } from '@tanstack/react-query';

import { api } from '@services/api';

import { IChampionshipsDTO } from '@dtos/championship-dto';

import { HeaderApp } from '@components/HeaderApp';
import { Loading } from '@components/Loading';

import {
  ChampionshipsButton,
  ChampionshipsContainer,
  ChampionshipsContent,
  ChampionshipsDescription,
  ChampionshipsEmptyContainer,
  ChampionshipsEmptyInfo,
  ChampionshipsHeaderContainer,
  ChampionshipsHeaderTitleContainer,
  ChampionshipsHeaderTitleText,
  ChampionshipsImage,
  ChampionshipsItemContent,
  ChampionshipsList,
  Divider,
} from './styles';

export function ChampionshipsScreen() {
  const theme = useTheme();
  const navigation = useNavigation();

  // FUNCTIONS
  const handleDetailsChampionships = useCallback(
    (championshipId: string) => {
      navigation.navigate('detailsChampionshipsScreen', { championshipId });
    },
    [navigation],
  );
  // END FUNCTIONS

  // USE QUERY
  const { data: championships, isLoading: isLoadingChampionships } = useQuery<
    IChampionshipsDTO[] | undefined
  >({
    queryKey: ['championships'],
    queryFn: async () => {
      const response = await api.get('/championships');

      if (response.status === 200) {
        const championshipsData = response.data as IChampionshipsDTO[];

        return championshipsData;
      }
    },
  });
  // END USE QUERY

  return (
    <ChampionshipsContainer>
      <HeaderApp />

      <ChampionshipsContent>
        {isLoadingChampionships ? (
          <Loading />
        ) : (
          <ChampionshipsList
            contentContainerStyle={
              !championships || (championships && championships.length === 0)
                ? { flex: 1 }
                : {}
            }
            showsVerticalScrollIndicator={false}
            data={championships}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => <Divider />}
            renderItem={({ item: championshipItem }) => (
              <ChampionshipsButton
                onPress={() => {
                  handleDetailsChampionships(championshipItem.id);
                }}
              >
                <ChampionshipsHeaderContainer>
                  <ChampionshipsHeaderTitleContainer>
                    <ChampionshipsHeaderTitleText>
                      {championshipItem.name}
                    </ChampionshipsHeaderTitleText>
                  </ChampionshipsHeaderTitleContainer>
                </ChampionshipsHeaderContainer>

                <ChampionshipsItemContent>
                  {/*
                    Antes só aparecia se "avatar_url" existisse. Agora
                    sempre mostra algo (a logo da AMIP como placeholder
                    quando não há imagem, ou se ela falhar ao carregar).
                  */}
                  <ChampionshipsImage
                    source={{ uri: championshipItem.avatar_url }}
                    contentFit="cover"
                  />

                  <ChampionshipsDescription
                    numberOfLines={3}
                    ellipsizeMode="tail"
                  >
                    {championshipItem.description}
                  </ChampionshipsDescription>

                  <Feather
                    name="chevron-right"
                    size={25}
                    color={theme.COLORS['text-secondary']}
                  />
                </ChampionshipsItemContent>
              </ChampionshipsButton>
            )}
            ListEmptyComponent={() => (
              <ChampionshipsEmptyContainer>
                <ChampionshipsEmptyInfo>
                  Nenhum campeonato no momento.{'\n'}Em breve novos campeonatos
                  desafiadores estarão aqui.
                </ChampionshipsEmptyInfo>
              </ChampionshipsEmptyContainer>
            )}
          />
        )}
      </ChampionshipsContent>
    </ChampionshipsContainer>
  );
}
