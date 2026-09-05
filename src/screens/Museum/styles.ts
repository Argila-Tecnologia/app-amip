import styled, { css } from 'styled-components/native';

import { FlatList } from 'react-native';

import { RFValue } from '@utils/rf-value';

import { IMuseumDTO } from '@dtos/museum-dto';

import { FallbackImage } from '@components/FallbackImage';

export const MuseumsContainer = styled.View`
  flex: 1;

  background-color: ${({ theme }) => theme.COLORS.background};
`;

export const MuseumsContent = styled.View`
  flex: 1;

  padding: ${RFValue(16)}px;
`;

export const MuseumList =
  styled.FlatList<IMuseumDTO>`` as unknown as typeof FlatList;

export const Divider = styled.View`
  height: 0.3px;

  background-color: ${({ theme }) => theme.COLORS['text-secondary']};

  margin-bottom: ${RFValue(15)}px;
`;

export const MuseumButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.7,
})`
  margin-bottom: ${RFValue(20)}px;
`;

export const MuseumHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const MuseumHeaderTitleContainer = styled.View`
  width: ${RFValue(90)}%;
`;

export const MuseumHeaderTitle = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.BOLD};
    font-size: ${RFValue(theme.FONT_SIZE.LG)}px;
    color: ${theme.COLORS.text};
  `};

  font-weight: bold;
`;

export const MuseumItemContent = styled.View`
  width: 100%;

  flex-direction: row;
  align-items: center;

  margin-top: ${RFValue(10)}px;
`;

export const MuseumImage = styled(FallbackImage)`
  width: ${RFValue(50)}px;
  height: ${RFValue(50)}px;

  margin-right: ${RFValue(15)}px;

  border-radius: ${RFValue(7)}px;
` as unknown as typeof FallbackImage;

export const MuseumDescription = styled.Text`
  height: 100%;

  flex: 1;

  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.REGULAR};
    font-size: ${RFValue(theme.FONT_SIZE.MD)}px;
    color: ${theme.COLORS.text};
  `};

  text-align: justify;

  margin-right: 20px;
`;

export const MuseumsEmptyContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const MuseumsEmptyInfo = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.REGULAR};
    font-size: ${RFValue(theme.FONT_SIZE.MD)}px;
    color: ${theme.COLORS.text};
  `};

  text-align: center;
`;
