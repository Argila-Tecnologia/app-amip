import { LoadingContainer, LoadingIndicator } from './styles';

interface ILoadingProps {
  size?: 'small' | 'large';
  color?: string;
}

export function Loading({ size = 'small', color = '#138D75' }: ILoadingProps) {
  return (
    <LoadingContainer>
      <LoadingIndicator size={size} color={color} />
    </LoadingContainer>
  );
}
