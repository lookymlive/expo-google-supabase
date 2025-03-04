import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, Container, Input } from '../../components/ui';
import { supabase } from '../../services/supabase';
import { NavigationProps } from '../../types';
import { isValidEmail, isValidPassword } from '../../utils';

const RegisterScreen: React.FC<NavigationProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [userType, setUserType] = useState<'user' | 'business'>('user');
  const [loading, setLoading] = useState(false);

  // Estados para errores de validación
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [displayNameError, setDisplayNameError] = useState('');

  // Validar email
  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError('El email es requerido');
      return false;
    } else if (!isValidEmail(email)) {
      setEmailError('Ingresa un email válido');
      return false;
    }
    setEmailError('');
    return true;
  };

  // Validar contraseña
  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError('La contraseña es requerida');
      return false;
    } else if (!isValidPassword(password)) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres, una letra y un número');
      return false;
    }
    setPasswordError('');
    return true;
  };

  // Validar confirmación de contraseña
  const validateConfirmPassword = (confirmPassword: string) => {
    if (!confirmPassword) {
      setConfirmPasswordError('Confirma tu contraseña');
      return false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Las contraseñas no coinciden');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  // Validar nombre
  const validateDisplayName = (name: string) => {
    if (!name) {
      setDisplayNameError('El nombre es requerido');
      return false;
    } else if (name.length < 3) {
      setDisplayNameError('El nombre debe tener al menos 3 caracteres');
      return false;
    }
    setDisplayNameError('');
    return true;
  };

  // Validar formulario
  const validateForm = () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);
    const isDisplayNameValid = validateDisplayName(displayName);

    return isEmailValid && isPasswordValid && isConfirmPasswordValid && isDisplayNameValid;
  };

  // Registrar usuario
  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Registrar usuario en Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
            user_type: userType,
          },
        },
      });

      if (error) throw error;

      if (data?.user) {
        // Crear perfil en la tabla profiles
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              display_name: displayName,
              role: userType,
              created_at: new Date().toISOString(),
            },
          ]);

        if (profileError) throw profileError;

        Alert.alert(
          'Registro exitoso',
          'Se ha enviado un correo de confirmación a tu email',
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
        );
      }
    } catch (error: any) {
      Alert.alert('Error al registrarse', error.message || 'Ha ocurrido un error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Crear Cuenta</Text>
        <Text style={styles.subtitle}>Completa tus datos para registrarte</Text>

        <Input
          label="Nombre completo"
          placeholder="Ingresa tu nombre completo"
          value={displayName}
          onChangeText={setDisplayName}
          autoCapitalize="words"
          error={displayNameError}
          leftIcon={<Ionicons name="person-outline" size={20} color="#9E9E9E" />}
          onBlur={() => validateDisplayName(displayName)}
        />

        <Input
          label="Email"
          placeholder="Ingresa tu email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          error={emailError}
          leftIcon={<Ionicons name="mail-outline" size={20} color="#9E9E9E" />}
          onBlur={() => validateEmail(email)}
        />

        <Input
          label="Contraseña"
          placeholder="Ingresa tu contraseña"
          value={password}
          onChangeText={setPassword}
          isPassword
          error={passwordError}
          leftIcon={<Ionicons name="lock-closed-outline" size={20} color="#9E9E9E" />}
          onBlur={() => validatePassword(password)}
        />

        <Input
          label="Confirmar contraseña"
          placeholder="Confirma tu contraseña"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          isPassword
          error={confirmPasswordError}
          leftIcon={<Ionicons name="lock-closed-outline" size={20} color="#9E9E9E" />}
          onBlur={() => validateConfirmPassword(confirmPassword)}
        />

        <Text style={styles.label}>Tipo de cuenta:</Text>
        <View style={styles.radioContainer}>
          <TouchableOpacity
            style={[
              styles.radioButton,
              userType === 'user' && styles.radioSelected,
            ]}
            onPress={() => setUserType('user')}
          >
            <Ionicons
              name="person"
              size={20}
              color={userType === 'user' ? '#fff' : '#333'}
            />
            <Text style={[
              styles.radioText,
              userType === 'user' && styles.radioTextSelected,
            ]}>
              Usuario
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.radioButton,
              userType === 'business' && styles.radioSelected,
            ]}
            onPress={() => setUserType('business')}
          >
            <Ionicons
              name="business"
              size={20}
              color={userType === 'business' ? '#fff' : '#333'}
            />
            <Text style={[
              styles.radioText,
              userType === 'business' && styles.radioTextSelected,
            ]}>
              Comercio
            </Text>
          </TouchableOpacity>
        </View>

        <Button
          title="Registrarse"
          onPress={handleRegister}
          loading={loading}
          fullWidth
          style={styles.registerButton}
        />

        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={styles.loginLink}
        >
          <Text style={styles.loginText}>
            ¿Ya tienes una cuenta? <Text style={styles.loginHighlight}>Inicia sesión</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  radioContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  radioButton: {
    flex: 1,
    flexDirection: 'row',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    backgroundColor: '#4285F4',
    borderColor: '#4285F4',
  },
  radioText: {
    fontWeight: '500',
    marginLeft: 8,
    color: '#333',
  },
  radioTextSelected: {
    color: '#fff',
  },
  registerButton: {
    marginTop: 10,
  },
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: '#666',
  },
  loginHighlight: {
    color: '#4285F4',
    fontWeight: 'bold',
  },
});

export default RegisterScreen; 