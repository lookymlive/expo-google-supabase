import React from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/**
 * Componente Button personalizado
 * Proporciona estilos consistentes para los botones de la aplicación
 */
const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
  fullWidth = false,
  leftIcon,
  rightIcon,
  ...props
}) => {
  // Determinar estilos según la variante
  const getVariantStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryButton;
      case 'secondary':
        return styles.secondaryButton;
      case 'outline':
        return styles.outlineButton;
      case 'danger':
        return styles.dangerButton;
      default:
        return styles.primaryButton;
    }
  };

  // Determinar estilos de texto según la variante
  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryText;
      case 'secondary':
        return styles.secondaryText;
      case 'outline':
        return styles.outlineText;
      case 'danger':
        return styles.dangerText;
      default:
        return styles.primaryText;
    }
  };

  // Determinar estilos según el tamaño
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallButton;
      case 'medium':
        return styles.mediumButton;
      case 'large':
        return styles.largeButton;
      default:
        return styles.mediumButton;
    }
  };

  // Determinar estilos de texto según el tamaño
  const getTextSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallText;
      case 'medium':
        return styles.mediumText;
      case 'large':
        return styles.largeText;
      default:
        return styles.mediumText;
    }
  };

  // En caso de que haya rightIcon o leftIcon, asegurar que no puedan ser strings
  const leftIconElement = leftIcon ? (
    typeof leftIcon === 'string' ? <Text>{leftIcon}</Text> : leftIcon
  ) : null;

  const rightIconElement = rightIcon ? (
    typeof rightIcon === 'string' ? <Text>{rightIcon}</Text> : rightIcon
  ) : null;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        getVariantStyle(),
        getSizeStyle(),
        fullWidth && styles.fullWidth,
        disabled && styles.disabledButton,
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? '#4285F4' : '#fff'}
          size="small"
        />
      ) : (
        <View style={styles.contentContainer}>
          {leftIconElement ? (
            <View style={styles.leftIconContainer}>{leftIconElement}</View>
          ) : null}
          <Text
            style={[
              styles.text,
              getTextStyle(),
              getTextSizeStyle(),
              disabled && styles.disabledText,
              textStyle,
            ]}
          >
            {title}
          </Text>
          {rightIconElement ? (
            <View style={styles.rightIconContainer}>{rightIconElement}</View>
          ) : null}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
  },
  leftIconContainer: {
    marginRight: 8,
  },
  rightIconContainer: {
    marginLeft: 8,
  },
  // Variantes
  primaryButton: {
    backgroundColor: '#4285F4',
  },
  primaryText: {
    color: '#fff',
  },
  secondaryButton: {
    backgroundColor: '#34A853',
  },
  secondaryText: {
    color: '#fff',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4285F4',
  },
  outlineText: {
    color: '#4285F4',
  },
  dangerButton: {
    backgroundColor: '#EA4335',
  },
  dangerText: {
    color: '#fff',
  },
  // Tamaños
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  smallText: {
    fontSize: 12,
  },
  mediumButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  mediumText: {
    fontSize: 14,
  },
  largeButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  largeText: {
    fontSize: 16,
  },
  // Estados
  disabledButton: {
    backgroundColor: '#E1E1E1',
    borderColor: '#E1E1E1',
  },
  disabledText: {
    color: '#9E9E9E',
  },
  // Ancho completo
  fullWidth: {
    width: '100%',
  },
});

export default Button; 