import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
}

/**
 * Componente Input personalizado
 * Proporciona estilos consistentes para los inputs de la aplicación
 */
const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  labelStyle,
  inputStyle,
  errorStyle,
  leftIcon,
  rightIcon,
  isPassword = false,
  secureTextEntry,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const leftIconElement = leftIcon ? (
    typeof leftIcon === 'string' ? <Text>{leftIcon}</Text> : leftIcon
  ) : null;

  const rightIconElement = rightIcon ? (
    typeof rightIcon === 'string' ? <Text>{rightIcon}</Text> : rightIcon
  ) : null;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}

      <View style={styles.inputContainer}>
        {leftIcon && leftIconElement ? (
          <View style={styles.leftIconContainer}>{leftIconElement}</View>
        ) : null}

        <TextInput
          style={[
            styles.input,
            leftIcon ? styles.inputWithLeftIcon : undefined,
            (rightIcon || isPassword) ? styles.inputWithRightIcon : undefined,
            error ? styles.inputError : undefined,
            inputStyle,
          ]}
          secureTextEntry={isPassword ? !isPasswordVisible : secureTextEntry}
          placeholderTextColor="#9E9E9E"
          {...props}
        />

        {isPassword ? (
          <TouchableOpacity
            style={styles.rightIconContainer}
            onPress={togglePasswordVisibility}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#9E9E9E"
            />
          </TouchableOpacity>
        ) : (
          rightIconElement ? (
            <View style={styles.rightIconContainer}>{rightIconElement}</View>
          ) : null
        )}
      </View>

      {error && <Text style={[styles.error, errorStyle]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#fff',
  },
  inputWithLeftIcon: {
    paddingLeft: 48,
  },
  inputWithRightIcon: {
    paddingRight: 48,
  },
  inputError: {
    borderColor: '#EA4335',
  },
  leftIconContainer: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  rightIconContainer: {
    position: 'absolute',
    right: 16,
    zIndex: 1,
  },
  error: {
    fontSize: 12,
    color: '#EA4335',
    marginTop: 4,
  },
});

export default Input; 