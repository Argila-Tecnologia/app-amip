import styled, { css } from 'styled-components/native';

import { Switch, TouchableOpacity, Platform } from 'react-native';

import { RFValue } from 'react-native-responsive-fontsize';

export const SignUpContainer = styled.View`
  flex: 1;

  background-color: ${({ theme }) => theme.COLORS['gray-color-100']};

  padding: ${RFValue(0)}px ${RFValue(0)}px
    ${Platform.OS === 'android' ? 280 : 40}px;
`;

export const SignUpContent = styled.View`
  flex: 1;

  margin-top: ${RFValue(20)}px;

  padding: ${RFValue(16)}px;
`;

export const FormContainer = styled.View`
  width: 100%;

  flex: 1;
`;

export const BoxMaritalStatus = styled.View``;

export const FooterContainer = styled.View`
  flex: 1;

  flex-direction: row;
  justify-content: flex-end;

  margin-top: ${RFValue(20)}px;
  margin-bottom: ${RFValue(10)}px;
`;

export const BoxActionButton = styled(TouchableOpacity).attrs({
  activeOpacity: 0.7,
})`
  width: ${RFValue(150)}px;
  height: ${RFValue(50)}px;

  align-items: center;
  justify-content: center;

  margin-left: ${RFValue(65)}px;

  background-color: ${({ theme }) => theme.COLORS['blue-dark-color']};

  border-radius: 6px;
`;

export const BoxActionButtonText = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.BOLD};
    font-size: ${RFValue(theme.FONT_SIZE.LG)}px;
    color: ${theme.COLORS['white-color']};
  `};

  text-transform: uppercase;
`;

export const BoxPostalCode = styled.View`
  width: 81.5%;

  flex-direction: row;
  align-items: center;
`;

export const SearchPostalCodeButton = styled.TouchableOpacity.attrs({
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

export const BoxState = styled.View``;

export const Label = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.REGULAR};
    font-size: ${RFValue(theme.FONT_SIZE.MD)}px;
    color: ${theme.COLORS['gray-color-400']};
  `};
`;

export const BoxCity = styled.View`
  margin: ${RFValue(8)}px 0;
`;

export const BoxBloodType = styled.View`
  margin-bottom: ${RFValue(10)}px;
`;

export const EnabledSwitchContainer = styled.View`
  flex: 1;

  flex-direction: row;
  justify-content: space-between;

  margin-top: ${RFValue(10)}px;
  margin-bottom: ${RFValue(10)}px;
`;

export const EnabledSwitch = styled(Switch)``;
