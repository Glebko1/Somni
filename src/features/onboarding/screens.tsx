import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import { Button } from 'react-native';

import { fetchOnboardingData } from './services';
import { FeatureScreen } from '@/shared/ui/FeatureScreen';
import { RootStackParamList } from '@/app/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

export function OnboardingScreen({ navigation }: Props) {
  const load = useCallback(() => fetchOnboardingData(), []);

  return (
    <>
      <FeatureScreen title="Onboarding Flow" load={load} />
      <Button title="Finish onboarding" onPress={() => navigation.replace('Main')} />
    </>
  );
}
