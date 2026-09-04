import styled, { css } from 'styled-components/native';

import { RFValue } from '@utils/rf-value';

import { FallbackImage } from '@components/FallbackImage';

export const ProfileContainer = styled.View`
  flex: 1;

  background-color: ${({ theme }) => theme.COLORS['gray-color-100']};
`;

export const ProfileHeader = styled.View`
  width: 100%;
  /* height: ${RFValue(70)}px; */

  flex-direction: row;

  background-color: ${({ theme }) => theme.COLORS['blue-dark-color']};

  padding: ${RFValue(0)}px ${RFValue(8)}px ${RFValue(15)}px;
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

  margin-right: ${RFValue(10)}px;
`;

export const ProfileHeaderTitle = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.BOLD};
    font-size: ${RFValue(theme.FONT_SIZE.LG)}px;
    color: ${theme.COLORS['white-color']};
  `};

  margin-left: ${RFValue(5)}px;
`;

export const ProfileHeaderLogoutContainer = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;

  margin-right: ${RFValue(10)}px;
`;

export const ProfileHeaderLogoutButton = styled.TouchableOpacity``;

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

export const ProfileAvatarImage = styled(FallbackImage)`
  width: ${RFValue(166)}px;
  height: ${RFValue(166)}px;

  border-radius: ${RFValue(98)}px;

  align-self: center;
` as unknown as typeof FallbackImage;

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
  font-size: ${({ theme }) => RFValue(theme.FONT_SIZE.LG)}px;
  color: ${({ theme }) => theme.COLORS['black-color']};
`;

export const ProfileRemoveAccountButton = styled.TouchableOpacity`
  height: 50px;

  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.COLORS['red-color']};

  border-radius: 10px;

  margin-top: 50px;

  padding: 10px;
`;

export const ProfileRemoveAccountText = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.REGULAR};
    font-size: ${RFValue(theme.FONT_SIZE.MD)}px;
    color: ${theme.COLORS['white-color']};
  `};
`;
