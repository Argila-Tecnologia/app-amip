import styled, { css } from 'styled-components/native';

import { FlatList } from 'react-native';

import { RFValue } from '@utils/rf-value';

import { INewsDTO } from '@dtos/news-dto';

import { FallbackImage } from '@components/FallbackImage';

export const NewsContainer = styled.View`
  flex: 1;

  background-color: ${({ theme }) => theme.COLORS['gray-color-100']};
`;

export const NewsContent = styled.View`
  flex: 1;

  padding: ${RFValue(16)}px;
`;

export const NewsList =
  styled.FlatList<INewsDTO>`` as unknown as typeof FlatList;

export const Divider = styled.View`
  height: 0.3px;

  background-color: ${({ theme }) => theme.COLORS['gray-color-400']};

  margin-bottom: ${RFValue(15)}px;
`;

export const NewsButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.7,
})`
  margin-bottom: ${RFValue(20)}px;
`;

export const NewsHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const NewsHeaderTitleContainer = styled.View`
  width: ${RFValue(90)}%;
`;

export const NewsHeaderTitle = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.BOLD};
    font-size: ${RFValue(theme.FONT_SIZE.LG)}px;
    color: ${theme.COLORS['black-color']};
  `};

  font-weight: bold;
`;

export const NewsItem = styled.View`
  width: 100%;

  flex-direction: row;
  align-items: center;

  margin-top: ${RFValue(10)}px;
`;

export const NewsImage = styled(FallbackImage)`
  width: ${RFValue(50)}px;
  height: ${RFValue(50)}px;

  margin-right: ${RFValue(15)}px;

  border-radius: ${RFValue(7)}px;
` as unknown as typeof FallbackImage;

export const NewsDescription = styled.Text`
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

export const NewsEmptyContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const NewsEmptyInfo = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.REGULAR};
    font-size: ${RFValue(theme.FONT_SIZE.MD)}px;
    color: ${theme.COLORS['black-color']};
  `};

  text-align: center;
`;
