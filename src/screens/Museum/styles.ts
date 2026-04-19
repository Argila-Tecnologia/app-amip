import styled, { css } from 'styled-components/native';
import { FlatList } from 'react-native';
import { Image } from 'expo-image';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { IMuseumDTO } from '@dtos/museum-dto';

export const MuseumsContainer = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.COLORS['gray-color-100']};
`;

export const MuseumsContent = styled.View`
  flex: 1;
  padding: ${scale(16)}px;
`;

export const MuseumList =
  styled.FlatList<IMuseumDTO>`` as unknown as typeof FlatList;

export const Divider = styled.View`
  height: ${moderateScale(0.5)}px;

  background-color: ${({ theme }) => theme.COLORS['gray-color-400']};

  margin-bottom: ${verticalScale(15)}px;
`;

export const MuseumButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.7,
})`
  margin-bottom: ${verticalScale(20)}px;
`;

export const MuseumHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const MuseumHeaderTitleContainer = styled.View`
  flex: 1;
`;

export const MuseumHeaderTitle = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.BOLD};
    font-size: ${moderateScale(theme.FONT_SIZE.LG)}px;
    color: ${theme.COLORS['black-color']};
  `};
`;

export const MuseumItemContent = styled.View`
  width: 100%;

  flex-direction: row;
  align-items: center;

  margin-top: ${verticalScale(10)}px;
`;

export const MuseumImage = styled(Image)`
  width: ${scale(50)}px;
  height: ${verticalScale(50)}px;

  margin-right: ${scale(15)}px;

  border-radius: ${moderateScale(7)}px;
` as unknown as typeof Image;

export const MuseumDescription = styled.Text`
  flex: 1;

  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.REGULAR};
    font-size: ${moderateScale(theme.FONT_SIZE.MD)}px;
    color: ${theme.COLORS['black-color']};
  `};

  text-align: justify;

  margin-right: ${scale(20)}px;
`;

export const MuseumsEmptyContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const MuseumsEmptyInfo = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.REGULAR};
    font-size: ${moderateScale(theme.FONT_SIZE.MD)}px;
    color: ${theme.COLORS['black-color']};
  `};

  text-align: center;
`;
