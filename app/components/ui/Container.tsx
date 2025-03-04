import React from 'react';
import { StyleProp, StyleSheet, ViewProps, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SafeView from './SafeView';

interface ContainerProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
  useSafeArea?: boolean;
  children: React.ReactNode;
}

/**
 * Componente contenedor principal para las pantallas
 * Proporciona márgenes consistentes y opcionalmente usa SafeAreaView
 */
const Container: React.FC<ContainerProps> = ({
  children,
  style,
  useSafeArea = true,
  ...props
}) => {
  if (useSafeArea) {
    return (
      <SafeAreaView style={[styles.container, style]} {...props}>
        {children}
      </SafeAreaView>
    );
  }

  return (
    <SafeView style={[styles.container, style]} {...props}>
      {children}
    </SafeView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
});

export default Container; 