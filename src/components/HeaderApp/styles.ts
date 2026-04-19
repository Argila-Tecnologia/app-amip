import styled, { css } from 'styled-components/native';

import { Image } from 'expo-image';

import { SafeAreaView } from 'react-native-safe-area-context';

import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

export const HeaderAppContainer = styled(SafeAreaView)`
  width: 100%;

  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  background-color: ${({ theme }) => theme.COLORS['blue-dark-color']};

  padding: ${verticalScale(10)}px ${scale(8)}px ${verticalScale(15)}px;

  min-height: ${verticalScale(70)}px;
`;

export const HeaderAppBox = styled.View`
  flex: 1;
`;

export const HeaderAppLogoImage = styled(Image)`
  width: ${scale(100)}px;
  height: ${verticalScale(60)}px;

  margin-horizontal: ${scale(10)}px;
` as unknown as typeof Image;

export const HeaderAppTitle = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.BOLD};
    font-size: ${moderateScale(theme.FONT_SIZE.LG)}px;
    color: ${theme.COLORS['white-color']};
  `};
`;

export const HeaderAppProfileButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.7,
})`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;

  margin-top: ${verticalScale(10)}px;
`;

export const HeaderAppBoxProfile = styled.View`
  margin-right: ${scale(10)}px;
`;

export const HeaderAppPersonText = styled.Text`
  width: ${scale(120)}px;

  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.REGULAR};
    font-size: ${moderateScale(theme.FONT_SIZE.MD)}px;
    color: ${theme.COLORS['white-color']};
  `};
`;

export const HeaderAppPersonPhotoImage = styled(Image)`
  width: ${scale(50)}px;
  height: ${verticalScale(50)}px;

  border-radius: ${moderateScale(25)}px;
` as unknown as typeof Image;

export const HeaderAppPersonPhotoIcon = styled.View`
  width: ${scale(50)}px;
  height: ${verticalScale(50)}px;

  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.COLORS['white-color']};

  border-radius: ${moderateScale(25)}px;
`;
