import styled from 'styled-components/native';

export const LoadingContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.COLORS['blue-dark-color']};
`;

export const LoadingIndicator = styled.ActivityIndicator.attrs(({ theme }) => ({
  color: theme.COLORS['white-color'],
}))``;
