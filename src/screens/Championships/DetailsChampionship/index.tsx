import { useCallback } from 'react';

import { Alert, ScrollView, Linking } from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';

import { Feather } from '@expo/vector-icons';

import { useTheme } from 'styled-components/native';

import { useQuery } from '@tanstack/react-query';

import Toast from 'react-native-toast-message';

import { api } from '@services/api';

import { useAuth } from '@hooks/auth';

import { IChampionshipsDTO } from '@dtos/championship-dto';

import { Loading } from '@components/Loading';
import { Header } from '@components/Header';
import { Button } from '@components/Form/Button';

import {
  DetailChampionshipContainer,
  DetailChampionshipContent,
  DetailChampionshipIconContainer,
  DetailChampionshipImage,
  DetailChampionshipInfoContainer,
  DetailChampionshipInfoDescription,
  DetailChampionshipLinkVideoButton,
  DetailChampionshipLinkVideoButtonText,
  DetailChampionshipPlaceDateContainer,
  DetailChampionshipPlaceDateContent,
  DetailChampionshipPlaceDateText,
  DetailChampionshipTitle,
} from './styles';

type IDetailChampionshipRouteParams = {
  championshipId: string;
};

export function DetailsChampionshipScreen() {
  const theme = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const { player } = useAuth();

  const { championshipId } = route.params as IDetailChampionshipRouteParams;

  // FUNCTIONS
  const handlePressLinkVideo = useCallback(async (video: string) => {
    try {
      const canOpenVideo = await Linking.canOpenURL(video);

      if (canOpenVideo) {
        await Linking.openURL(video);
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text2: 'Não foi possível abrir o vídeo.',
      });
    }
  }, []);

  const handleSubscriptionChampionship = useCallback(
    async (championshipId: string) => {
      if (player) {
        navigation.navigate('subscriptionScreen', {
          championshipId,
        });
      } else {
        const message = 'Painel informativo';
        Alert.alert('Equipe AMIP', message, [
          {
            text: 'REALIZAR LOGIN',
            style: 'default',
            onPress: () => {
              if (player) {
                navigation.navigate('subscriptionScreen');
              } else {
                navigation.navigate('signInScreen');
              }
            },
          },
        ]);
      }
    },
    [navigation, player],
  );
  // END FUNCTIONS

  // USE QUERY
  const { data: championship, isLoading: isLoadingDetailChampionship } =
    useQuery<IChampionshipsDTO | undefined>({
      queryKey: ['detailChampionship', championshipId],
      queryFn: async () => {
        const response = await api.get(`/championships/show/${championshipId}`);

        if (response.status === 200) {
          const detailsChampionshipData = response.data as IChampionshipsDTO;

          console.log('retorno', detailsChampionshipData);

          return detailsChampionshipData;
        }
      },
    });
  // END USE QUERY

  return (
    <DetailChampionshipContainer>
      <Header title="Campeonatos" />

      {isLoadingDetailChampionship ? (
        <Loading />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {championship && (
            <DetailChampionshipContent>
              <DetailChampionshipTitle>
                {championship.name}
              </DetailChampionshipTitle>

              <DetailChampionshipInfoContainer>
                {championship.avatar_url && (
                  <DetailChampionshipImage
                    source={{ uri: championship.avatar_url }}
                    contentFit="cover"
                  />
                )}

                <DetailChampionshipInfoDescription>
                  {championship.description}
                </DetailChampionshipInfoDescription>

                <DetailChampionshipPlaceDateContainer>
                  <DetailChampionshipIconContainer>
                    <Feather
                      name="home"
                      size={15}
                      color={theme.COLORS['black-color']}
                    />
                  </DetailChampionshipIconContainer>

                  <DetailChampionshipPlaceDateContent>
                    <DetailChampionshipPlaceDateText>
                      mkmkmkmkmkmkmkmkmLocal: {championship.place}
                    </DetailChampionshipPlaceDateText>
                  </DetailChampionshipPlaceDateContent>

                  <DetailChampionshipPlaceDateContainer>
                    <DetailChampionshipIconContainer>
                      <Feather
                        name="calendar"
                        size={15}
                        color={theme.COLORS['black-color']}
                      />
                    </DetailChampionshipIconContainer>

                    {/* <DetailChampionshipPlaceDateContent>
                      <DetailChampionshipPlaceDateText>
                        Data: {championship.date}
                      </DetailChampionshipPlaceDateText>
                    </DetailChampionshipPlaceDateContent> */}
                  </DetailChampionshipPlaceDateContainer>
                </DetailChampionshipPlaceDateContainer>

                {championship.value > 0 && (
                  <DetailChampionshipPlaceDateContainer>
                    <DetailChampionshipIconContainer>
                      <Feather
                        name="dollar-sign"
                        size={15}
                        color={theme.COLORS['black-color']}
                      />

                      <DetailChampionshipPlaceDateContent>
                        <DetailChampionshipPlaceDateText>
                          Valor: {championship.value / 100}
                        </DetailChampionshipPlaceDateText>
                      </DetailChampionshipPlaceDateContent>
                    </DetailChampionshipIconContainer>
                  </DetailChampionshipPlaceDateContainer>
                )}

                {championship.video_url && (
                  <DetailChampionshipLinkVideoButton
                    onPress={() => {
                      handlePressLinkVideo(championship.video_url);
                    }}
                  >
                    <DetailChampionshipLinkVideoButtonText>
                      Veja mais detalhes do campeonato neste vídeo.
                    </DetailChampionshipLinkVideoButtonText>
                  </DetailChampionshipLinkVideoButton>
                )}
              </DetailChampionshipInfoContainer>

              <Button
                onPress={() => {
                  handleSubscriptionChampionship(championship.id);
                }}
              >
                Inscreva-se aqui!
              </Button>
            </DetailChampionshipContent>
          )}
        </ScrollView>
      )}
    </DetailChampionshipContainer>
  );
}
