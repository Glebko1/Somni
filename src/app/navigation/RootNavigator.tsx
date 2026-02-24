import { Suspense, lazy } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

import { MainTabs } from './MainTabs';
import { darkTheme } from '@/shared/theme/theme';
import { palette } from '@/shared/theme/palette';

const OnboardingScreen = lazy(async () => ({ default: (await import('@/features/onboarding/screens')).OnboardingScreen }));
const SleepDiaryScreen = lazy(async () => ({ default: (await import('@/features/sleepDiary/screens')).SleepDiaryScreen }));
const SosScreen = lazy(async () => ({ default: (await import('@/features/sos/screens')).SosScreen }));
const AudioScreen = lazy(async () => ({ default: (await import('@/features/audio/screens')).AudioScreen }));
const VoiceScreen = lazy(async () => ({ default: (await import('@/features/voice/screens')).VoiceScreen }));
const WidgetScreen = lazy(async () => ({ default: (await import('@/features/widget/screens')).WidgetScreen }));
const HealthScreen = lazy(async () => ({ default: (await import('@/features/health/screens')).HealthScreen }));
const SomnikScreen = lazy(async () => ({ default: (await import('@/features/somnik/screens')).SomnikScreen }));
const GamificationScreen = lazy(async () => ({ default: (await import('@/features/gamification/screens')).GamificationScreen }));
const RewardsScreen = lazy(async () => ({ default: (await import('@/features/rewards/screens')).RewardsScreen }));
const FriendsScreen = lazy(async () => ({ default: (await import('@/features/friends/screens')).FriendsScreen }));
const RemindersScreen = lazy(async () => ({ default: (await import('@/features/reminders/screens')).RemindersScreen }));
const RelaxGameScreen = lazy(async () => ({ default: (await import('@/features/relax-game/screens')).RelaxGameScreen }));
const PaywallScreen = lazy(async () => ({ default: (await import('@/features/paywall/screens')).PaywallScreen }));

const Stack = createNativeStackNavigator();

export function RootNavigator() {
  return (
    <NavigationContainer theme={darkTheme}>
      <Suspense
        fallback={
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: palette.background }}>
            <ActivityIndicator color={palette.accent} />
          </View>
        }
      >
        <Stack.Navigator screenOptions={{ freezeOnBlur: true }}>
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
          <Stack.Screen name="SleepDiary" component={SleepDiaryScreen} />
          <Stack.Screen name="Sos" component={SosScreen} />
          <Stack.Screen name="Audio" component={AudioScreen} />
          <Stack.Screen name="Voice" component={VoiceScreen} />
          <Stack.Screen name="Widget" component={WidgetScreen} />
          <Stack.Screen name="Health" component={HealthScreen} />
          <Stack.Screen name="Somnik" component={SomnikScreen} />
          <Stack.Screen name="Gamification" component={GamificationScreen} />
          <Stack.Screen name="Rewards" component={RewardsScreen} />
          <Stack.Screen name="Friends" component={FriendsScreen} />
          <Stack.Screen name="Reminders" component={RemindersScreen} />
          <Stack.Screen name="RelaxGame" component={RelaxGameScreen} options={{ title: 'Relax Mini Game' }} />
          <Stack.Screen name="Paywall" component={PaywallScreen} />
        </Stack.Navigator>
      </Suspense>
    </NavigationContainer>
  );
}
