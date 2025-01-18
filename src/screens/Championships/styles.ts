import styled, { css } from 'styled-components/native';

import { FlatList } from 'react-native';

import { Image } from 'expo-image';

import { RFValue } from 'react-native-responsive-fontsize';

import { IChampionshipsDTO } from '@dtos/championship-dto';

export const ChampionshipsContainer = styled.View`
  flex: 1;

  background-color: ${({ theme }) => theme.COLORS['gray-color-100']};
`;

export const ChampionshipsContent = styled.View`
  flex: 1;

  padding: ${RFValue(16)}px;
`;

export const ChampionshipsList =
  styled.FlatList<IChampionshipsDTO>`` as unknown as typeof FlatList;

export const Divider = styled.View`
  height: 0.3px;

  background-color: ${({ theme }) => theme.COLORS['gray-color-400']};

  margin-bottom: ${RFValue(15)}px;
`;

export const ChampionshipsButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.7,
})`
  margin-bottom: ${RFValue(20)}px;
`;

export const ChampionshipsHeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const ChampionshipsHeaderTitleContainer = styled.View`
  width: ${RFValue(90)}%;
`;

export const ChampionshipsHeaderTitleText = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.BOLD};
    font-size: ${RFValue(theme.FONT_SIZE.LG)}px;
    color: ${theme.COLORS['black-color']};
  `};

  font-weight: bold;
`;

export const ChampionshipsItemContent = styled.View`
  width: 100%;

  flex-direction: row;
  align-items: center;

  margin-top: ${RFValue(10)}px;
`;

export const ChampionshipsImage = styled(Image)`
  width: ${RFValue(50)}px;
  height: ${RFValue(50)}px;

  margin-right: ${RFValue(15)}px;

  border-radius: ${RFValue(7)}px;
` as unknown as typeof Image;

export const ChampionshipsDescription = styled.Text`
  height: 100%;

  flex: 1;

  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.REGULAR};
    font-size: ${RFValue(theme.FONT_SIZE.MD)}px;
    color: ${theme.COLORS['black-color']};
  `};

  text-align: justify;

  margin-right: 20px;
`;

export const ChampionshipsEmptyContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const ChampionshipsEmptyInfo = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.REGULAR};
    font-size: ${RFValue(theme.FONT_SIZE.MD)}px;
    color: ${theme.COLORS['white-color']};
  `};
`;
