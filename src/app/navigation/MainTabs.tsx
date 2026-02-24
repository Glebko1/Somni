import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { DreamsScreen } from '@/features/dreams/screens';
import { SleepDiaryScreen } from '@/features/sleepDiary/screens';
import { WorryDumpScreen } from '@/features/worryDump/screens';

const Tab = createBottomTabNavigator();

export function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="SleepDiaryTab" component={SleepDiaryScreen} options={{ title: 'Diary' }} />
      <Tab.Screen name="DreamsTab" component={DreamsScreen} options={{ title: 'Dreams' }} />
      <Tab.Screen name="WorryDumpTab" component={WorryDumpScreen} options={{ title: 'Worry Dump' }} />
    </Tab.Navigator>
  );
}
