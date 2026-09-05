import { useCallback } from 'react';

import { ScrollView, Linking } from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Feather } from '@expo/vector-icons';

import { useTheme } from 'styled-components/native';

import { useQuery } from '@tanstack/react-query';

import Toast from 'react-native-toast-message';

import { api } from '@services/api';

import { IChampionshipsDTO } from '@dtos/championship-dto';

import { Loading } from '@components/Loading';
import { Header } from '@components/Header';
import { Button } from '@components/Form/Button';

import {
  DetailChampionshipContainer,
  DetailChampionshipContent,
  DetailChampionshipIconContainer,
  DetailChampionshipImage,
  DetailChampionshipImageContainer,
  DetailChampionshipInfoContainer,
  DetailChampionshipInfoDescription,
  DetailChampionshipInfoRow,
  DetailChampionshipLinkVideoButton,
  DetailChampionshipLinkVideoButtonText,
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
  const insets = useSafeAreaInsets();

  const { championshipId } = route.params as IDetailChampionshipRouteParams;

  const paddingBottom = insets.bottom;

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

  // Antes tinha um if/else aqui checando "if (player)" - "player" nunca é
  // null/undefined (começa como {} quando deslogado, e {} é truthy em
  // JS), então essa condição sempre foi verdadeira e o alerta "faça
  // login" (com um botão que, por sinal, tinha a mesma checagem invertida
  // e ia parar na própria tela de inscrição) nunca rodava de verdade -
  // sempre navegava direto. Como a inscrição é aberta a todos por
  // decisão de produto (o backend e a tela Subscription já suportam
  // inscrição sem login, player_id opcional), não tem motivo pra manter
  // esse branch morto: simplificado pra sempre navegar direto.
  const handleSubscriptionChampionship = useCallback(
    (championshipId: string) => {
      navigation.navigate('subscriptionScreen', {
        championshipId,
      });
    },
    [navigation],
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
        <ScrollView
          contentContainerStyle={{
            paddingBottom,
          }}
          style={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {championship && (
            <DetailChampionshipContent>
              <DetailChampionshipTitle>
                {championship.name}
              </DetailChampionshipTitle>

              <DetailChampionshipInfoContainer>
                {/*
                  Antes só aparecia se "avatar_url" existisse - sem
                  imagem, o espaço simplesmente sumia. FallbackImage já
                  mostra a logo da AMIP tanto pra esse caso quanto se a
                  imagem existir mas falhar ao carregar.
                */}
                <DetailChampionshipImageContainer>
                  <DetailChampionshipImage
                    source={{ uri: championship.avatar_url }}
                    contentFit="cover"
                  />
                </DetailChampionshipImageContainer>

                <DetailChampionshipInfoDescription>
                  {championship.description}
                </DetailChampionshipInfoDescription>

                <DetailChampionshipInfoRow>
                  <DetailChampionshipIconContainer>
                    <Feather
                      name="home"
                      size={15}
                      color={theme.COLORS.text}
                    />
                  </DetailChampionshipIconContainer>

                  <DetailChampionshipPlaceDateContent>
                    <DetailChampionshipPlaceDateText>
                      Local: {championship.place}
                    </DetailChampionshipPlaceDateText>
                  </DetailChampionshipPlaceDateContent>
                </DetailChampionshipInfoRow>

                <DetailChampionshipInfoRow>
                  <DetailChampionshipIconContainer>
                    <Feather
                      name="calendar"
                      size={15}
                      color={theme.COLORS.text}
                    />
                  </DetailChampionshipIconContainer>

                  <DetailChampionshipPlaceDateContent>
                    <DetailChampionshipPlaceDateText>
                      Data: {championship.date}
                    </DetailChampionshipPlaceDateText>
                  </DetailChampionshipPlaceDateContent>
                </DetailChampionshipInfoRow>

                {championship.value > 0 && (
                  <DetailChampionshipInfoRow>
                    <DetailChampionshipIconContainer>
                      <Feather
                        name="dollar-sign"
                        size={15}
                        color={theme.COLORS.text}
                      />
                    </DetailChampionshipIconContainer>

                    <DetailChampionshipPlaceDateContent>
                      <DetailChampionshipPlaceDateText>
                        Valor: {championship.value / 100}
                      </DetailChampionshipPlaceDateText>
                    </DetailChampionshipPlaceDateContent>
                  </DetailChampionshipInfoRow>
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
