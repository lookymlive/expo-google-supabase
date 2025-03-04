import React from 'react';
import { ActivityIndicator, StyleProp, StyleSheet, Text, TextStyle, View, ViewProps, ViewStyle } from 'react-native';

interface LoadingProps extends ViewProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  fullScreen?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

/**
 * Componente Loading para mostrar indicadores de carga
 */
const Loading: React.FC<LoadingProps> = ({
  size = 'large',
  color = '#4285F4',
  text,
  fullScreen = false,
  containerStyle,
  textStyle,
  ...props
}) => {
  return (
    <View
      style={[
        styles.container,
        fullScreen && styles.fullScreen,
        containerStyle,
      ]}
      {...props}
    >
      <ActivityIndicator size={size} color={color} />
      {text ? <Text style={[styles.text, textStyle]}>{text}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  text: {
    marginTop: 12,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
});

export default Loading; 