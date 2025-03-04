import React from 'react';
import { StyleProp, StyleSheet, ViewProps, ViewStyle } from 'react-native';
import SafeView from './SafeView';

interface CardProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

/**
 * Componente Card para mostrar elementos en listas
 * Proporciona sombras y bordes redondeados consistentes
 */
const Card: React.FC<CardProps> = ({
  children,
  style,
  ...props
}) => {
  return (
    <SafeView
      style={[styles.card, style]}
      {...props}
    >
      {children}
    </SafeView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
    // Sombras para iOS/Android
    elevation: 3,
    // Sombras para web
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  },
});

export default Card; 