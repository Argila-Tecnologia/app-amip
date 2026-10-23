import { useMemo } from 'react';

import { useTheme } from 'styled-components/native';

import { useQuery } from '@tanstack/react-query';

import { format } from 'date-fns';

import { Feather } from '@expo/vector-icons';

import { api } from '@services/api';

import { IMyChargeDTO } from '@dtos/charge-dto';

import { Header } from '@components/Header';
import { Loading } from '@components/Loading';

import {
  MyChargesContainer,
  MyChargesContent,
  MyChargesCurrentCard,
  MyChargesCurrentTopRow,
  MyChargesCurrentLabel,
  MyChargesStatusPill,
  MyChargesAmount,
  MyChargesDueRow,
  MyChargesDueLabel,
  MyChargesDueDate,
  MyChargesPayButton,
  MyChargesPayButtonText,
  MyChargesHistoryTitle,
  MyChargesHistoryList,
  MyChargesHistoryRow,
  MyChargesHistoryIcon,
  MyChargesHistoryInfo,
  MyChargesHistoryLabel,
  MyChargesHistoryProgram,
  MyChargesHistoryAmountColumn,
  MyChargesHistoryAmount,
  MyChargesHistoryStatus,
  MyChargesEmptyContainer,
  MyChargesEmptyText,
} from './styles';

// Cores e texto de cada status - mesmos tokens de tema usados no resto do
// app (orange-color/red-color/green-color), nada novo inventado aqui.
function getStatusMeta(
  status: IMyChargeDTO['status'],
  theme: ReturnType<typeof useTheme>,
) {
  switch (status) {
    case 'PAID':
      return {
        label: 'PAGO',
        color: theme.COLORS['green-color'],
        icon: 'check-circle' as const,
      };
    case 'OVERDUE':
      return {
        label: 'ATRASADO',
        color: theme.COLORS['red-color'],
        icon: 'alert-triangle' as const,
      };
    default:
      return {
        label: 'PENDENTE',
        color: theme.COLORS['orange-color'],
        icon: 'clock' as const,
      };
  }
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
}

export function MyChargesScreen() {
  const theme = useTheme();

  // USE QUERY
  const { data: charges, isLoading: isLoadingCharges } = useQuery<
    IMyChargeDTO[] | undefined
  >({
    queryKey: ['myCharges'],
    queryFn: async () => {
      const response = await api.get('/charges/me');

      if (response.status === 200) {
        return response.data as IMyChargeDTO[];
      }
    },
  });
  // END USE QUERY

  // A API já devolve a lista ordenada por vencimento decrescente (mais
  // nova primeiro) - aqui só separamos qual vira "fatura atual" em
  // destaque e o que sobra vira histórico, sem reordenar nada.
  const { currentCharge, historyCharges } = useMemo(() => {
    const allCharges = charges ?? [];

    // "Fatura atual" = a não paga (pendente ou atrasada) com vencimento
    // mais próximo - entre as em aberto, a mais antiga é a mais urgente
    // (se tiver atrasada, ela aparece antes de qualquer pendente futura).
    const unpaidSortedByOldestDueDate = allCharges
      .filter((charge) => charge.status !== 'PAID')
      .sort(
        (a, b) =>
          new Date(a.due_date).getTime() - new Date(b.due_date).getTime(),
      );

    // Sem nenhuma em aberto, cai pra mais recente já paga - como a lista já
    // vem decrescente por vencimento, o primeiro "PAID" encontrado já é o
    // mais recente.
    const mostRecentPaid = allCharges.find(
      (charge) => charge.status === 'PAID',
    );

    const current = unpaidSortedByOldestDueDate[0] ?? mostRecentPaid;

    const history = allCharges.filter((charge) => charge.id !== current?.id);

    return { currentCharge: current, historyCharges: history };
  }, [charges]);

  return (
    <MyChargesContainer>
      <Header title="Minhas faturas" />

      {isLoadingCharges ? (
        <Loading />
      ) : (
        <MyChargesContent
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            !charges || charges.length === 0 ? { flex: 1 } : {}
          }
        >
          {!charges || charges.length === 0 ? (
            <MyChargesEmptyContainer>
              <MyChargesEmptyText>
                Nenhuma fatura encontrada.
              </MyChargesEmptyText>
            </MyChargesEmptyContainer>
          ) : (
            <>
              {currentCharge && (
                <MyChargesCurrentCard>
                  <MyChargesCurrentTopRow>
                    <MyChargesCurrentLabel>
                      {currentCharge.description} · {currentCharge.program_name}
                    </MyChargesCurrentLabel>

                    <MyChargesStatusPill
                      $color={getStatusMeta(currentCharge.status, theme).color}
                    >
                      {getStatusMeta(currentCharge.status, theme).label}
                    </MyChargesStatusPill>
                  </MyChargesCurrentTopRow>

                  <MyChargesAmount>
                    {formatCurrency(currentCharge.amount)}
                  </MyChargesAmount>

                  <MyChargesDueRow>
                    <MyChargesDueLabel>
                      Vencimento{'\n'}
                      <MyChargesDueDate>
                        {format(new Date(currentCharge.due_date), 'dd/MM/yyyy')}
                      </MyChargesDueDate>
                    </MyChargesDueLabel>

                    {/*
                      Sem gateway de pagamento ainda (decisão pendente da
                      diretoria) - o botão fica visível, mas desabilitado e
                      claramente marcado como "em breve", em vez de
                      prometer uma ação que ainda não existe.
                    */}
                    <MyChargesPayButton>
                      <Feather
                        name="clock"
                        size={14}
                        color={theme.COLORS['text-secondary']}
                      />
                      <MyChargesPayButtonText>Em breve</MyChargesPayButtonText>
                    </MyChargesPayButton>
                  </MyChargesDueRow>
                </MyChargesCurrentCard>
              )}

              <MyChargesHistoryTitle>Faturas anteriores</MyChargesHistoryTitle>

              <MyChargesHistoryList>
                {historyCharges.map((charge) => {
                  const statusMeta = getStatusMeta(charge.status, theme);

                  return (
                    <MyChargesHistoryRow key={charge.id}>
                      <MyChargesHistoryIcon
                        $tintColor={`${statusMeta.color}33`}
                      >
                        <Feather
                          name={statusMeta.icon}
                          size={16}
                          color={statusMeta.color}
                        />
                      </MyChargesHistoryIcon>

                      <MyChargesHistoryInfo>
                        <MyChargesHistoryLabel>
                          {charge.description}
                        </MyChargesHistoryLabel>
                        <MyChargesHistoryProgram>
                          {charge.program_name} · Venc.{' '}
                          {format(new Date(charge.due_date), 'dd/MM')}
                        </MyChargesHistoryProgram>
                      </MyChargesHistoryInfo>

                      <MyChargesHistoryAmountColumn>
                        <MyChargesHistoryAmount>
                          {formatCurrency(charge.amount)}
                        </MyChargesHistoryAmount>
                        <MyChargesHistoryStatus $color={statusMeta.color}>
                          {statusMeta.label}
                        </MyChargesHistoryStatus>
                      </MyChargesHistoryAmountColumn>
                    </MyChargesHistoryRow>
                  );
                })}
              </MyChargesHistoryList>
            </>
          )}
        </MyChargesContent>
      )}
    </MyChargesContainer>
  );
}
