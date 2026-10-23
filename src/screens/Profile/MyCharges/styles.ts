import styled, { css } from 'styled-components/native';

import { RFValue } from '@utils/rf-value';

export const MyChargesContainer = styled.View`
  flex: 1;

  background-color: ${({ theme }) => theme.COLORS.background};
`;

export const MyChargesContent = styled.ScrollView`
  flex: 1;

  padding: ${RFValue(16)}px;
`;

export const MyChargesCurrentCard = styled.View`
  background-color: ${({ theme }) => theme.COLORS.surface};

  border-width: 1px;
  border-color: ${({ theme }) => theme.COLORS.border};
  border-radius: ${RFValue(14)}px;

  padding: ${RFValue(16)}px;

  margin-bottom: ${RFValue(24)}px;
`;

export const MyChargesCurrentTopRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  margin-bottom: ${RFValue(10)}px;
`;

export const MyChargesCurrentLabel = styled.Text`
  flex: 1;

  font-size: ${RFValue(12)}px;
  color: ${({ theme }) => theme.COLORS['text-secondary']};

  margin-right: ${RFValue(8)}px;
`;

export const MyChargesStatusPill = styled.Text<{ $color: string }>`
  font-size: ${RFValue(10)}px;
  font-weight: bold;
  color: ${({ $color }) => $color};

  background-color: ${({ $color }) => `${$color}33`};

  padding: ${RFValue(3)}px ${RFValue(8)}px;
  border-radius: 999px;

  overflow: hidden;
`;

export const MyChargesAmount = styled.Text`
  font-size: ${RFValue(26)}px;
  font-weight: bold;
  color: ${({ theme }) => theme.COLORS.text};

  margin-bottom: ${RFValue(14)}px;
`;

export const MyChargesDueRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const MyChargesDueLabel = styled.Text`
  font-size: ${RFValue(11)}px;
  color: ${({ theme }) => theme.COLORS['text-secondary']};
`;

export const MyChargesDueDate = styled.Text`
  font-size: ${RFValue(14)}px;
  font-weight: bold;
  color: ${({ theme }) => theme.COLORS.text};
`;

// Botão "Pagar" desabilitado/"em breve" - sem gateway de pagamento ainda.
// De propósito uma View simples, não um TouchableOpacity: não faz sentido
// dar feedback de toque num botão que não tem nenhuma ação por trás.
export const MyChargesPayButton = styled.View`
  flex-direction: row;
  align-items: center;

  background-color: ${({ theme }) => theme.COLORS.border};

  padding: ${RFValue(10)}px ${RFValue(16)}px;
  border-radius: 999px;
`;

export const MyChargesPayButtonText = styled.Text`
  font-size: ${RFValue(13)}px;
  font-weight: bold;
  color: ${({ theme }) => theme.COLORS['text-secondary']};

  margin-left: ${RFValue(6)}px;
`;

export const MyChargesHistoryTitle = styled.Text`
  font-size: ${RFValue(14)}px;
  font-weight: bold;
  color: ${({ theme }) => theme.COLORS.text};

  margin-bottom: ${RFValue(12)}px;
`;

export const MyChargesHistoryList = styled.View`
  gap: ${RFValue(10)}px;
`;

export const MyChargesHistoryRow = styled.View`
  flex-direction: row;
  align-items: center;

  background-color: ${({ theme }) => theme.COLORS.surface};

  border-width: 1px;
  border-color: ${({ theme }) => theme.COLORS.border};
  border-radius: ${RFValue(12)}px;

  padding: ${RFValue(12)}px;
`;

export const MyChargesHistoryIcon = styled.View<{ $tintColor: string }>`
  width: ${RFValue(34)}px;
  height: ${RFValue(34)}px;

  align-items: center;
  justify-content: center;

  background-color: ${({ $tintColor }) => $tintColor};
  border-radius: ${RFValue(10)}px;

  margin-right: ${RFValue(12)}px;
`;

export const MyChargesHistoryInfo = styled.View`
  flex: 1;
`;

export const MyChargesHistoryLabel = styled.Text`
  font-size: ${RFValue(13)}px;
  color: ${({ theme }) => theme.COLORS.text};
`;

export const MyChargesHistoryProgram = styled.Text`
  font-size: ${RFValue(11)}px;
  color: ${({ theme }) => theme.COLORS['text-secondary']};
`;

export const MyChargesHistoryAmountColumn = styled.View`
  align-items: flex-end;
`;

export const MyChargesHistoryAmount = styled.Text`
  font-size: ${RFValue(13)}px;
  font-weight: bold;
  color: ${({ theme }) => theme.COLORS.text};
`;

export const MyChargesHistoryStatus = styled.Text<{ $color: string }>`
  font-size: ${RFValue(10)}px;
  font-weight: bold;
  color: ${({ $color }) => $color};
`;

export const MyChargesEmptyContainer = styled.View`
  flex: 1;

  align-items: center;
  justify-content: center;

  padding: ${RFValue(24)}px;
`;

export const MyChargesEmptyText = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.REGULAR};
    font-size: ${RFValue(theme.FONT_SIZE.MD)}px;
    color: ${theme.COLORS['text-secondary']};
  `};

  text-align: center;
`;
