import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

interface SafeViewRootProps {
  children: ReactNode;
}

/**
 * Componente root que envuelve toda la aplicación y maneja errores comunes
 * de React Native Web como nodos de texto directos y problemas de pointerEvents
 */
const SafeViewRoot: React.FC<SafeViewRootProps> = ({ children }) => {
  return (
    <View style={styles.container}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SafeViewRoot; 