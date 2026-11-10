import { useState } from 'react';

import { ActivityIndicator, Alert } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from 'styled-components/native';

import { useQuery } from '@tanstack/react-query';

import { AxiosError } from 'axios';

import Toast from 'react-native-toast-message';

import { api } from '@services/api';

import { IMyPlayerProgramDTO } from '@dtos/player-program-dto';

import { Header } from '@components/Header';
import { Loading } from '@components/Loading';

import {
  MyPlayerProgramsContainer,
  MyPlayerProgramsContent,
  MyPlayerProgramsList,
  MyPlayerProgramCard,
  MyPlayerProgramTopRow,
  MyPlayerProgramName,
  MyPlayerProgramStatusPill,
  MyPlayerProgramAmount,
  MyPlayerProgramCancelButton,
  MyPlayerProgramCancelButtonText,
  MyPlayerProgramsEmptyContainer,
  MyPlayerProgramsEmptyText,
} from './styles';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
}

export function MyPlayerProgramsScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  // Id do vínculo que está em processo de cancelamento agora mesmo (não
  // um boolean genérico) - evita que cancelar um vínculo deixe os OUTROS
  // cards (de um atleta com mais de um PlayerProgram, ex: time principal
  // + projeto social) com o botão desabilitado também enquanto a
  // requisição está em andamento.
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // USE QUERY
  const {
    data: playerPrograms,
    isLoading: isLoadingPlayerPrograms,
    refetch: refetchPlayerPrograms,
  } = useQuery<IMyPlayerProgramDTO[] | undefined>({
    queryKey: ['myPlayerPrograms'],
    queryFn: async () => {
      const response = await api.get('/player_programs/me');

      if (response.status === 200) {
        return response.data as IMyPlayerProgramDTO[];
      }
    },
  });
  // END USE QUERY

  // Ação irreversível e de dinheiro real (ver CLAUDE.md, "Cancelamento de
  // mensalidade - self-service pelo app") - sempre confirma antes, mesmo
  // padrão já usado em handleSignOut (Profile/index.tsx), só que com um
  // texto mais sério pra essa ação.
  function handleCancelPlayerProgram(playerProgram: IMyPlayerProgramDTO) {
    Alert.alert(
      'Equipe AMIP',
      `Deseja cancelar sua mensalidade de ${playerProgram.program_name}? Essa ação não pode ser desfeita - pra voltar, você precisa falar com a equipe da AMIP.`,
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
              setCancellingId(playerProgram.id);

              await api.post(`/player_programs/me/${playerProgram.id}/cancel`);

              Toast.show({
                type: 'success',
                text2: 'Mensalidade cancelada',
                position: 'bottom',
              });

              await refetchPlayerPrograms();
            } catch (error) {
              if (error instanceof AxiosError && error.response) {
                Toast.show({
                  type: 'error',
                  position: 'bottom',
                  text1: 'Equipe AMIP',
                  text2: 'Não foi possível cancelar a mensalidade!',
                });

                return;
              }

              Toast.show({
                type: 'error',
                position: 'bottom',
                text1: 'Equipe AMIP',
                text2: 'Não foi possível cancelar a mensalidade!',
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
    <MyPlayerProgramsContainer>
      <Header title="Minhas matrículas" />

      {isLoadingPlayerPrograms ? (
        <Loading />
      ) : (
        <MyPlayerProgramsContent
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            !playerPrograms || playerPrograms.length === 0
              ? { flex: 1, paddingBottom: insets.bottom }
              : { paddingBottom: insets.bottom }
          }
        >
          {!playerPrograms || playerPrograms.length === 0 ? (
            <MyPlayerProgramsEmptyContainer>
              <MyPlayerProgramsEmptyText>
                Nenhuma matrícula encontrada.
              </MyPlayerProgramsEmptyText>
            </MyPlayerProgramsEmptyContainer>
          ) : (
            <MyPlayerProgramsList>
              {playerPrograms.map((playerProgram) => (
                <MyPlayerProgramCard key={playerProgram.id}>
                  <MyPlayerProgramTopRow>
                    <MyPlayerProgramName>
                      {playerProgram.program_name}
                    </MyPlayerProgramName>

                    <MyPlayerProgramStatusPill
                      $color={
                        playerProgram.is_active
                          ? theme.COLORS['green-color']
                          : theme.COLORS['text-secondary']
                      }
                    >
                      {playerProgram.is_active ? 'ATIVA' : 'CANCELADA'}
                    </MyPlayerProgramStatusPill>
                  </MyPlayerProgramTopRow>

                  <MyPlayerProgramAmount>
                    {formatCurrency(playerProgram.monthly_fee)}/mês
                  </MyPlayerProgramAmount>

                  {/*
                    Só mostra o botão pra vínculos ainda ativos - o
                    backend rejeita cancelar um já cancelado com 400 (ver
                    CancelPlayerProgramSubscriptionUseCase), então nem
                    oferece a ação nesse caso.
                  */}
                  {playerProgram.is_active && (
                    <MyPlayerProgramCancelButton
                      disabled={cancellingId === playerProgram.id}
                      onPress={() => handleCancelPlayerProgram(playerProgram)}
                    >
                      {cancellingId === playerProgram.id ? (
                        <ActivityIndicator
                          size="small"
                          color={theme.COLORS['white-color']}
                        />
                      ) : (
                        <MyPlayerProgramCancelButtonText>
                          Cancelar mensalidade
                        </MyPlayerProgramCancelButtonText>
                      )}
                    </MyPlayerProgramCancelButton>
                  )}
                </MyPlayerProgramCard>
              ))}
            </MyPlayerProgramsList>
          )}
        </MyPlayerProgramsContent>
      )}
    </MyPlayerProgramsContainer>
  );
}
