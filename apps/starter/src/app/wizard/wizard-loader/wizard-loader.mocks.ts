import { LottiePlayer } from 'lottie-web';

import { LoadingPage } from '../wizard.types';

export const MOCK_LOADING_PAGE: LoadingPage = {
  id: 'Loading',
  type: 'loading',

  title: '',
  animation: '/test.json',
  dimensions: '50px',
  labels: ['Label 1', 'Label 2'],
};

export const MOCK_LOTTIE_PLAYER = {
  loadAnimation: () => null,
} as unknown as LottiePlayer;
