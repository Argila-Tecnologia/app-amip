import styled, { css } from 'styled-components/native';
import { Switch, TouchableOpacity } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

export const EditProfileContainer = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.COLORS['gray-color-100']};
`;

export const EditProfileContent = styled.View`
  flex: 1;

  padding: ${scale(16)}px;
  margin-top: ${verticalScale(20)}px;
`;

export const EditProfileForm = styled.View``;

export const EditProfileMaritalStatusContainer = styled.View``;

export const Label = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.REGULAR};
    font-size: ${moderateScale(theme.FONT_SIZE.MD)}px;
    color: ${theme.COLORS['gray-color-400']};
  `};
`;

export const EditProfileButtonContainer = styled.View`
  flex-direction: row;
  justify-content: flex-end;

  margin-top: ${verticalScale(10)}px;
  margin-bottom: ${verticalScale(10)}px;
`;

export const EditProfileActionButton = styled(TouchableOpacity).attrs({
  activeOpacity: 0.7,
})`
  min-width: ${scale(140)}px;
  height: ${verticalScale(50)}px;

  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.COLORS['blue-dark-color']};
  border-radius: ${moderateScale(6)}px;
`;

export const EditProfileActionButtonText = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.BOLD};
    font-size: ${moderateScale(theme.FONT_SIZE.LG)}px;
    color: ${theme.COLORS['white-color']};
  `};

  text-transform: uppercase;
`;

export const EditProfilePostalCodeContainer = styled.View`
  width: 100%;

  flex-direction: row;
  align-items: center;
`;

export const EditProfileSearchPostalCodeButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.7,
})`
  width: ${scale(50)}px;
  height: ${verticalScale(40)}px;

  align-items: center;
  justify-content: center;

  margin-bottom: ${verticalScale(10)}px;
  margin-left: ${scale(10)}px;

  border-radius: ${moderateScale(5)}px;
`;

export const EditProfileStateContainer = styled.View``;

export const BoxCity = styled.View`
  margin: ${verticalScale(8)}px 0;
`;

export const EditProfileBloodTypeContainer = styled.View`
  margin-bottom: ${verticalScale(10)}px;
`;

export const EditProfileEnabledSwitchContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  margin-top: ${verticalScale(10)}px;
  margin-bottom: ${verticalScale(10)}px;
`;

export const EditProfileEnabledSwitch = styled(Switch)``;
