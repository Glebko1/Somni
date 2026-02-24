import 'react-native-gesture-handler';

import { ActivityIndicator, View } from 'react-native';

import { RootNavigator } from '@/app/navigation/RootNavigator';
import { useBootstrap } from '@/shared/hooks/useBootstrap';
import { palette } from '@/shared/theme/palette';
import { AppErrorBoundary } from '@/shared/ui/AppErrorBoundary';
import { useAppStore } from '@/store/appStore';

export default function App() {
  useBootstrap();
  const isHydrated = useAppStore((state) => state.isHydrated);

  if (!isHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: palette.background }}>
        <ActivityIndicator color={palette.accent} />
      </View>
    );
  }

  return (
    <AppErrorBoundary>
      <RootNavigator />
    </AppErrorBoundary>
  );
}
