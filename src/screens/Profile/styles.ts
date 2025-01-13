import styled from 'styled-components/native';

import { Image } from 'expo-image';

import { RFValue } from 'react-native-responsive-fontsize';

export const ProfileContainer = styled.View`
  flex: 1;
`;

export const ProfileContent = styled.View`
  flex: 1;

  padding: 0 ${RFValue(16)}px;
`;

export const ProfileAvatarImageNameContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;

  margin-top: ${RFValue(25)}px;
`;

export const ProfileAvatarButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.7,
})`
  width: ${RFValue(166)}px;
  height: ${RFValue(166)}px;

  background-color: ${({ theme }) => theme.COLORS['gray-color-200']};

  border-radius: ${RFValue(98)}px;

  margin-top: ${RFValue(32)}px;

  position: relative;
`;

export const ProfileAvatarImage = styled(Image)`
  width: ${RFValue(166)}px;
  height: ${RFValue(166)}px;

  border-radius: ${RFValue(98)}px;

  align-self: center;
` as unknown as typeof Image;

export const ProfileAvatarCamera = styled.View`
  width: ${RFValue(50)}px;
  height: ${RFValue(50)}px;

  position: absolute;
  right: 0;
  bottom: 5px;

  background-color: ${({ theme }) => theme.COLORS['black-color']};

  border-radius: 25px;

  align-items: center;
  justify-content: center;

  margin-right: ${RFValue(5)}px;
`;

export const ProfileName = styled.Text`
  margin-top: ${RFValue(30)}px;

  font-size: ${RFValue(30)}px;
  color: ${({ theme }) => theme.COLORS['black-color']};
`;

export const ProfilePlayerLogoutAvatarImage = styled.View`
  width: ${RFValue(166)}px;
  height: ${RFValue(166)}px;

  border-radius: ${RFValue(98)}px;

  align-items: center;
  justify-content: center;

  /* margin-top: ${RFValue(10)}px; */

  background-color: ${({ theme }) => theme.COLORS['gray-color-300']};
`;

export const ProfileOptionsContent = styled.View`
  flex: 1;

  margin-top: ${RFValue(50)}px;
`;

export const ProfileOptionButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.7,
})`
  flex-direction: row;
  align-items: center;

  margin: ${RFValue(10)}px 0;
`;

export const ProfileOptionButtonIcon = styled.View`
  margin-right: ${RFValue(20)}px;
`;

export const ProfileOptionButtonTitle = styled.Text`
  font-size: ${({ theme }) => RFValue(theme.FONT_SIZE.XL)}px;
  color: ${({ theme }) => theme.COLORS['black-color']};
`;
