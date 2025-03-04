import React from 'react';
import { Image, ImageStyle, StyleProp, StyleSheet, Text, TextStyle, View, ViewProps, ViewStyle } from 'react-native';

interface AvatarProps extends ViewProps {
  source?: { uri: string } | null;
  name?: string;
  size?: number;
  containerStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  textStyle?: StyleProp<TextStyle>;
}

/**
 * Componente Avatar para mostrar imágenes de perfil o iniciales
 */
const Avatar: React.FC<AvatarProps> = ({
  source,
  name = '',
  size = 48,
  containerStyle,
  imageStyle,
  textStyle,
  ...props
}) => {
  // Obtener iniciales del nombre
  const getInitials = () => {
    if (!name) return '';

    const nameParts = name.split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }

    return (
      nameParts[0].charAt(0).toUpperCase() +
      nameParts[nameParts.length - 1].charAt(0).toUpperCase()
    );
  };

  // Generar color basado en el nombre
  const getColor = () => {
    if (!name) return '#4285F4';

    const colors = [
      '#4285F4', // Google Blue
      '#EA4335', // Google Red
      '#FBBC05', // Google Yellow
      '#34A853', // Google Green
      '#673AB7', // Purple
      '#3F51B5', // Indigo
      '#2196F3', // Blue
      '#009688', // Teal
      '#FF5722', // Deep Orange
      '#795548', // Brown
    ];

    const charCodeSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colors[charCodeSum % colors.length];
  };

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: !source ? getColor() : 'transparent',
        },
        containerStyle,
      ]}
      {...props}
    >
      {source ? (
        <Image
          source={source}
          style={[
            styles.image,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
            imageStyle,
          ]}
        />
      ) : (
        <Text
          style={[
            styles.text,
            {
              fontSize: size * 0.4,
            },
            textStyle,
          ]}
        >
          {getInitials()}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  text: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default Avatar; 