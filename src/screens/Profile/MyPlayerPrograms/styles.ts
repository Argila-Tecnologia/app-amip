import styled, { css } from 'styled-components/native';

import { RFValue } from '@utils/rf-value';

export const MyPlayerProgramsContainer = styled.View`
  flex: 1;

  background-color: ${({ theme }) => theme.COLORS.background};
`;

export const MyPlayerProgramsContent = styled.ScrollView`
  flex: 1;

  padding: ${RFValue(16)}px;
`;

export const MyPlayerProgramsList = styled.View`
  gap: ${RFValue(14)}px;
`;

export const MyPlayerProgramCard = styled.View`
  background-color: ${({ theme }) => theme.COLORS.surface};

  border-width: 1px;
  border-color: ${({ theme }) => theme.COLORS.border};
  border-radius: ${RFValue(14)}px;

  padding: ${RFValue(16)}px;
`;

export const MyPlayerProgramTopRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  margin-bottom: ${RFValue(10)}px;
`;

export const MyPlayerProgramName = styled.Text`
  flex: 1;

  font-size: ${RFValue(15)}px;
  font-weight: bold;
  color: ${({ theme }) => theme.COLORS.text};

  margin-right: ${RFValue(8)}px;
`;

export const MyPlayerProgramStatusPill = styled.Text<{ $color: string }>`
  font-size: ${RFValue(10)}px;
  font-weight: bold;
  color: ${({ $color }) => $color};

  background-color: ${({ $color }) => `${$color}33`};

  padding: ${RFValue(3)}px ${RFValue(8)}px;
  border-radius: 999px;

  overflow: hidden;
`;

export const MyPlayerProgramAmount = styled.Text`
  font-size: ${RFValue(20)}px;
  font-weight: bold;
  color: ${({ theme }) => theme.COLORS.text};

  margin-bottom: ${RFValue(14)}px;
`;

// Vermelho sólido, mesmo padrão já usado em "Remover conta" (ver
// Profile/styles.ts) - ação irreversível e de dinheiro real, precisa do
// mesmo peso visual.
export const MyPlayerProgramCancelButton = styled.TouchableOpacity`
  height: ${RFValue(42)}px;

  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.COLORS['red-color']};

  border-radius: ${RFValue(10)}px;
`;

export const MyPlayerProgramCancelButtonText = styled.Text`
  font-size: ${RFValue(13)}px;
  font-weight: bold;
  color: ${({ theme }) => theme.COLORS['white-color']};
`;

export const MyPlayerProgramsEmptyContainer = styled.View`
  flex: 1;

  align-items: center;
  justify-content: center;

  padding: ${RFValue(24)}px;
`;

export const MyPlayerProgramsEmptyText = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.REGULAR};
    font-size: ${RFValue(theme.FONT_SIZE.MD)}px;
    color: ${theme.COLORS['text-secondary']};
  `};

  text-align: center;
`;
