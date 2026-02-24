import { lazy } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const SleepDiaryScreen = lazy(async () => ({ default: (await import('@/features/sleepDiary/screens')).SleepDiaryScreen }));
const DreamsScreen = lazy(async () => ({ default: (await import('@/features/dreams/screens')).DreamsScreen }));
const RelaxGameScreen = lazy(async () => ({ default: (await import('@/features/relax-game/screens')).RelaxGameScreen }));
const WorryDumpScreen = lazy(async () => ({ default: (await import('@/features/worryDump/screens')).WorryDumpScreen }));

const Tab = createBottomTabNavigator();

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        lazy: true,
        freezeOnBlur: true,
        popToTopOnBlur: true
      }}
    >
      <Tab.Screen name="SleepDiaryTab" component={SleepDiaryScreen} options={{ title: 'Diary' }} />
      <Tab.Screen name="DreamsTab" component={DreamsScreen} options={{ title: 'Dreams' }} />
      <Tab.Screen name="RelaxTab" component={RelaxGameScreen} options={{ title: 'Relax' }} />
      <Tab.Screen name="WorryDumpTab" component={WorryDumpScreen} options={{ title: 'Worry Dump' }} />
    </Tab.Navigator>
  );
}
