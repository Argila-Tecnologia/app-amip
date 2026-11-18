import { useState } from 'react';

import { ActivityIndicator, Alert } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from 'styled-components/native';

import { useQuery } from '@tanstack/react-query';

import { AxiosError } from 'axios';

import Toast from 'react-native-toast-message';

import { api } from '@services/api';

import { IMySubscriptionDTO } from '@dtos/subscription-tournament-dto';

import { Header } from '@components/Header';
import { Loading } from '@components/Loading';

import {
  MySubscriptionsContainer,
  MySubscriptionsContent,
  MySubscriptionsList,
  MySubscriptionCard,
  MySubscriptionTopRow,
  MySubscriptionName,
  MySubscriptionStatusPill,
  MySubscriptionDate,
  MySubscriptionAmount,
  MySubscriptionCancelButton,
  MySubscriptionCancelButtonText,
  MySubscriptionsEmptyContainer,
  MySubscriptionsEmptyText,
} from './styles';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
}

export function MyTournamentSubscriptionsScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  // Id da inscrição que está em processo de cancelamento agora mesmo
  // (não um boolean genérico) - mesmo padrão de MyPlayerPrograms: evita
  // que cancelar uma inscrição deixe as OUTRAS com o botão desabilitado
  // também enquanto a requisição está em andamento.
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // USE QUERY
  const {
    data: subscriptions,
    isLoading: isLoadingSubscriptions,
    refetch: refetchSubscriptions,
  } = useQuery<IMySubscriptionDTO[] | undefined>({
    queryKey: ['myTournamentSubscriptions'],
    queryFn: async () => {
      const response = await api.get('/subscriptions/me');

      if (response.status === 200) {
        return response.data as IMySubscriptionDTO[];
      }
    },
  });
  // END USE QUERY

  // Ação irreversível e de dinheiro real (ver CLAUDE.md, "Cancelamento
  // de inscrição em torneio pelo próprio atleta") - sempre confirma
  // antes, mesmo padrão já usado em handleCancelPlayerProgram
  // (MyPlayerPrograms/index.tsx). Erro mostrado sempre genérico - nunca
  // o texto cru vindo do backend (decisão confirmada com o usuário): o
  // prazo de 24h esgotado, o campeonato sem start_date ainda, ou a
  // AbacatePay recusando o estorno automático caem todos no mesmo toast,
  // pedindo pra falar com a equipe.
  function handleCancelSubscription(subscription: IMySubscriptionDTO) {
    Alert.alert(
      'Equipe AMIP',
      `Deseja cancelar sua inscrição em ${subscription.championship_name}? Se já tiver sido paga, o valor é devolvido automaticamente. Essa ação não pode ser desfeita.`,
      [
        {
          text: 'Não',
          style: 'cancel',
          onPress: () => null,
        },
        {
          text: 'Sim, cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              setCancellingId(subscription.id);

              await api.post(`/subscriptions/me/${subscription.id}/cancel`);

              Toast.show({
                type: 'success',
                text2: 'Inscrição cancelada',
                position: 'bottom',
              });

              await refetchSubscriptions();
            } catch (error) {
              if (error instanceof AxiosError && error.response) {
                Toast.show({
                  type: 'error',
                  position: 'bottom',
                  text1: 'Equipe AMIP',
                  text2:
                    'Não foi possível cancelar a inscrição. Fale com a equipe AMIP.',
                });

                return;
              }

              Toast.show({
                type: 'error',
                position: 'bottom',
                text1: 'Equipe AMIP',
                text2:
                  'Não foi possível cancelar a inscrição. Fale com a equipe AMIP.',
              });
            } finally {
              setCancellingId(null);
            }
          },
        },
      ],
    );
  }

  return (
    <MySubscriptionsContainer>
      <Header title="Inscrições em torneios" />

      {isLoadingSubscriptions ? (
        <Loading />
      ) : (
        <MySubscriptionsContent
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            !subscriptions || subscriptions.length === 0
              ? { flex: 1, paddingBottom: insets.bottom }
              : { paddingBottom: insets.bottom }
          }
        >
          {!subscriptions || subscriptions.length === 0 ? (
            <MySubscriptionsEmptyContainer>
              <MySubscriptionsEmptyText>
                Nenhuma inscrição encontrada.
              </MySubscriptionsEmptyText>
            </MySubscriptionsEmptyContainer>
          ) : (
            <MySubscriptionsList>
              {subscriptions.map((subscription) => (
                <MySubscriptionCard key={subscription.id}>
                  <MySubscriptionTopRow>
                    <MySubscriptionName>
                      {subscription.championship_name}
                    </MySubscriptionName>

                    <MySubscriptionStatusPill
                      $color={
                        subscription.enabled
                          ? theme.COLORS['green-color']
                          : theme.COLORS['text-secondary']
                      }
                    >
                      {subscription.enabled ? 'ATIVA' : 'CANCELADA'}
                    </MySubscriptionStatusPill>
                  </MySubscriptionTopRow>

                  <MySubscriptionDate>
                    {subscription.championship_date}
                  </MySubscriptionDate>

                  <MySubscriptionAmount>
                    {formatCurrency(subscription.value / 100)}
                  </MySubscriptionAmount>

                  {/*
                    Só mostra o botão pra inscrições ainda ativas - o
                    backend rejeita cancelar uma já cancelada com 400 (ver
                    CancelSubscriptionUseCase), então nem oferece a ação
                    nesse caso. A checagem de prazo/start_date acontece
                    só na hora de cancelar (não impede o botão de
                    aparecer) - o erro genérico cobre esse caso também.
                  */}
                  {subscription.enabled && (
                    <MySubscriptionCancelButton
                      disabled={cancellingId === subscription.id}
                      onPress={() => handleCancelSubscription(subscription)}
                    >
                      {cancellingId === subscription.id ? (
                        <ActivityIndicator
                          size="small"
                          color={theme.COLORS['white-color']}
                        />
                      ) : (
                        <MySubscriptionCancelButtonText>
                          Cancelar inscrição
                        </MySubscriptionCancelButtonText>
                      )}
                    </MySubscriptionCancelButton>
                  )}
                </MySubscriptionCard>
              ))}
            </MySubscriptionsList>
          )}
        </MySubscriptionsContent>
      )}
    </MySubscriptionsContainer>
  );
}
