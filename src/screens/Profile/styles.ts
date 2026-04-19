import styled, { css } from 'styled-components/native';
import { Image } from 'expo-image';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

export const ProfileContainer = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.COLORS['gray-color-100']};
`;

export const ProfileHeader = styled.View`
  width: 100%;

  flex-direction: row;

  background-color: ${({ theme }) => theme.COLORS['blue-dark-color']};

  padding: 0 ${scale(8)}px ${verticalScale(15)}px;
`;

export const ProfileHeaderTitleContainer = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

export const ProfileHeaderBackButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.7,
})`
  flex-direction: row;
  align-items: center;

  margin-right: ${scale(10)}px;
`;

export const ProfileHeaderTitle = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.BOLD};
    font-size: ${moderateScale(theme.FONT_SIZE.LG)}px;
    color: ${theme.COLORS['white-color']};
  `};

  margin-left: ${scale(5)}px;
`;

export const ProfileHeaderLogoutContainer = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;

  margin-right: ${scale(10)}px;
`;

export const ProfileHeaderLogoutButton = styled.TouchableOpacity``;

export const ProfileContent = styled.View`
  flex: 1;

  padding: 0 ${scale(16)}px;
`;

export const ProfileAvatarImageNameContainer = styled.View`
  align-items: center;
  justify-content: center;

  margin-top: ${verticalScale(25)}px;
`;

const AVATAR_SIZE = moderateScale(160);

export const ProfileAvatarButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.7,
})`
  width: ${AVATAR_SIZE}px;
  height: ${AVATAR_SIZE}px;

  background-color: ${({ theme }) => theme.COLORS['gray-color-200']};

  border-radius: ${AVATAR_SIZE / 2}px;

  margin-top: ${verticalScale(32)}px;

  position: relative;
`;

export const ProfileAvatarImage = styled(Image)`
  width: ${AVATAR_SIZE}px;
  height: ${AVATAR_SIZE}px;

  border-radius: ${AVATAR_SIZE / 2}px;

  align-self: center;
` as unknown as typeof Image;

export const ProfileAvatarCamera = styled.View`
  width: ${moderateScale(50)}px;
  height: ${moderateScale(50)}px;

  position: absolute;
  right: 0;
  bottom: ${verticalScale(5)}px;

  background-color: ${({ theme }) => theme.COLORS['black-color']};

  border-radius: ${moderateScale(25)}px;

  align-items: center;
  justify-content: center;

  margin-right: ${scale(5)}px;
`;

export const ProfileName = styled.Text`
  margin-top: ${verticalScale(30)}px;

  font-size: ${moderateScale(24)}px;
  color: ${({ theme }) => theme.COLORS['black-color']};
`;

export const ProfilePlayerLogoutAvatarImage = styled.View`
  width: ${AVATAR_SIZE}px;
  height: ${AVATAR_SIZE}px;

  border-radius: ${AVATAR_SIZE / 2}px;

  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.COLORS['gray-color-300']};
`;

export const ProfileOptionsContent = styled.View`
  flex: 1;

  margin-top: ${verticalScale(50)}px;
`;

export const ProfileOptionButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.7,
})`
  flex-direction: row;
  align-items: center;

  margin: ${verticalScale(10)}px 0;
`;

export const ProfileOptionButtonIcon = styled.View`
  margin-right: ${scale(20)}px;
`;

export const ProfileOptionButtonTitle = styled.Text`
  font-size: ${({ theme }) => moderateScale(theme.FONT_SIZE.LG)}px;
  color: ${({ theme }) => theme.COLORS['black-color']};
`;

export const ProfileRemoveAccountButton = styled.TouchableOpacity`
  height: ${verticalScale(50)}px;

  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.COLORS['red-color']};

  border-radius: ${moderateScale(10)}px;

  margin-top: ${verticalScale(50)}px;

  padding: ${verticalScale(10)}px;
`;

export const ProfileRemoveAccountText = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.REGULAR};
    font-size: ${moderateScale(theme.FONT_SIZE.MD)}px;
    color: ${theme.COLORS['white-color']};
  `};
`;
