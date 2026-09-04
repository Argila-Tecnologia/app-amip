import styled, { css } from 'styled-components/native';

import { Switch, TouchableOpacity } from 'react-native';

import { RFValue } from '@utils/rf-value';

export const EditProfileContainer = styled.View`
  flex: 1;

  background-color: ${({ theme }) => theme.COLORS['gray-color-100']};
`;

export const EditProfileContent = styled.View`
  flex: 1;

  padding: ${RFValue(16)}px;

  margin-top: ${RFValue(20)}px;
`;

export const EditProfileForm = styled.View``;

export const EditProfileMaritalStatusContainer = styled.View``;

export const Label = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.REGULAR};
    font-size: ${RFValue(theme.FONT_SIZE.MD)}px;
    color: ${theme.COLORS['gray-color-400']};
  `};
`;

export const EditProfileButtonContainer = styled.View`
  flex: 1;

  flex-direction: row;
  justify-content: flex-end;

  margin-top: ${RFValue(10)}px;
  margin-bottom: ${RFValue(10)}px;
`;

export const EditProfileActionButton = styled(TouchableOpacity).attrs({
  activeOpacity: 0.7,
})`
  width: ${RFValue(150)}px;
  height: ${RFValue(60)}px;

  align-items: center;
  justify-content: center;

  margin-left: ${RFValue(65)}px;

  background-color: ${({ theme }) => theme.COLORS['blue-dark-color']};
  border-radius: 6px;
`;

export const EditProfileActionButtonText = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.BOLD};
    font-size: ${RFValue(theme.FONT_SIZE.LG)}px;
    color: ${theme.COLORS['white-color']};
  `};

  text-transform: uppercase;
`;

export const EditProfilePostalCodeContainer = styled.View`
  width: 81.5%;

  flex-direction: row;
  align-items: center;
`;

export const EditProfileSearchPostalCodeButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.7,
})`
  width: 50px;
  height: 40px;

  align-items: center;
  justify-content: center;

  margin-bottom: ${RFValue(10)}px;
  margin-left: ${RFValue(15)}px;

  border-radius: 5px;
`;

export const EditProfileStateContainer = styled.View``;

export const BoxCity = styled.View`
  margin: ${RFValue(8)}px 0;
`;

export const EditProfileBloodTypeContainer = styled.View`
  margin-bottom: ${RFValue(10)}px;
`;

export const EditProfileEnabledSwitchContainer = styled.View`
  flex: 1;

  flex-direction: row;
  justify-content: space-between;

  margin-top: ${RFValue(10)}px;
  margin-bottom: ${RFValue(10)}px;
`;

export const EditProfileEnabledSwitch = styled(Switch)``;
