import React from 'react';
import { StyleSheet } from 'react-native';
import Container from './Container';
import Loading from './Loading';

interface LoadingScreenProps {
  message?: string;
}

/**
 * Componente LoadingScreen para mostrar una pantalla de carga a pantalla completa
 */
const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = 'Cargando...' }) => {
  return (
    <Container style={styles.container} useSafeArea={false}>
      <Loading
        fullScreen
        text={message}
        size="large"
        color="#4285F4"
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
});

export default LoadingScreen; 