import styled, { css } from 'styled-components/native';

import { RFValue } from '@utils/rf-value';

export const MySubscriptionsContainer = styled.View`
  flex: 1;

  background-color: ${({ theme }) => theme.COLORS.background};
`;

export const MySubscriptionsContent = styled.ScrollView`
  flex: 1;

  padding: ${RFValue(16)}px;
`;

export const MySubscriptionsList = styled.View`
  gap: ${RFValue(14)}px;
`;

export const MySubscriptionCard = styled.View`
  background-color: ${({ theme }) => theme.COLORS.surface};

  border-width: 1px;
  border-color: ${({ theme }) => theme.COLORS.border};
  border-radius: ${RFValue(14)}px;

  padding: ${RFValue(16)}px;
`;

export const MySubscriptionTopRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  margin-bottom: ${RFValue(10)}px;
`;

export const MySubscriptionName = styled.Text`
  flex: 1;

  font-size: ${RFValue(15)}px;
  font-weight: bold;
  color: ${({ theme }) => theme.COLORS.text};

  margin-right: ${RFValue(8)}px;
`;

export const MySubscriptionStatusPill = styled.Text<{ $color: string }>`
  font-size: ${RFValue(10)}px;
  font-weight: bold;
  color: ${({ $color }) => $color};

  background-color: ${({ $color }) => `${$color}33`};

  padding: ${RFValue(3)}px ${RFValue(8)}px;
  border-radius: 999px;

  overflow: hidden;
`;

export const MySubscriptionDate = styled.Text`
  font-size: ${RFValue(13)}px;
  color: ${({ theme }) => theme.COLORS['text-secondary']};

  margin-bottom: ${RFValue(4)}px;
`;

export const MySubscriptionAmount = styled.Text`
  font-size: ${RFValue(20)}px;
  font-weight: bold;
  color: ${({ theme }) => theme.COLORS.text};

  margin-bottom: ${RFValue(14)}px;
`;

// Vermelho sólido, mesmo padrão já usado em "Cancelar mensalidade" (ver
// MyPlayerPrograms/styles.ts) e "Remover conta" - ação irreversível e de
// dinheiro real, precisa do mesmo peso visual.
export const MySubscriptionCancelButton = styled.TouchableOpacity`
  height: ${RFValue(42)}px;

  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.COLORS['red-color']};

  border-radius: ${RFValue(10)}px;
`;

export const MySubscriptionCancelButtonText = styled.Text`
  font-size: ${RFValue(13)}px;
  font-weight: bold;
  color: ${({ theme }) => theme.COLORS['white-color']};
`;

export const MySubscriptionsEmptyContainer = styled.View`
  flex: 1;

  align-items: center;
  justify-content: center;

  padding: ${RFValue(24)}px;
`;

export const MySubscriptionsEmptyText = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.REGULAR};
    font-size: ${RFValue(theme.FONT_SIZE.MD)}px;
    color: ${theme.COLORS['text-secondary']};
  `};

  text-align: center;
`;
