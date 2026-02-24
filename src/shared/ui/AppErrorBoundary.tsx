import { Component, ErrorInfo, ReactNode } from 'react';
import { Text, View } from 'react-native';

import { palette } from '@/shared/theme/palette';

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(_error: Error, _errorInfo: ErrorInfo) {
    // Intentionally avoid logging sensitive data to client logs in production.
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: palette.background, padding: 24 }}>
          <Text style={{ color: palette.text, textAlign: 'center' }}>Something went wrong. Please restart Somni.</Text>
        </View>
      );
    }

    return this.props.children;
  }
}
