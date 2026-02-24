import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { MainTabs } from './MainTabs';
import { darkTheme } from '@/shared/theme/theme';
import { AudioScreen } from '@/features/audio/screens';
import { FriendsScreen } from '@/features/friends/screens';
import { GamificationScreen } from '@/features/gamification/screens';
import { HealthScreen } from '@/features/health/screens';
import { OnboardingScreen } from '@/features/onboarding/screens';
import { PaywallScreen } from '@/features/paywall/screens';
import { RemindersScreen } from '@/features/reminders/screens';
import { RewardsScreen } from '@/features/rewards/screens';
import { SleepDiaryScreen } from '@/features/sleepDiary/screens';
import { SomnikScreen } from '@/features/somnik/screens';
import { SosScreen } from '@/features/sos/screens';
import { VoiceScreen } from '@/features/voice/screens';
import { WidgetScreen } from '@/features/widget/screens';

const Stack = createNativeStackNavigator();

export function RootNavigator() {
  return (
    <NavigationContainer theme={darkTheme}>
      <Stack.Navigator>
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
        <Stack.Screen name="Paywall" component={PaywallScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
