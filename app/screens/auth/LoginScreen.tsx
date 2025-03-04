import { Ionicons } from '@expo/vector-icons';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, Container, Input } from '../../components/ui';
import { supabase } from '../../services/supabase';
import { NavigationProps } from '../../types';

// Asegurar que WebBrowser redirija correctamente
WebBrowser.maybeCompleteAuthSession();

// Create a custom URL scheme for OAuth redirect - needed for web
const redirectUri = AuthSession.makeRedirectUri({
  useProxy: true,
  // Add path for web login to work correctly
  path: 'auth/callback'
});

const LoginScreen: React.FC<NavigationProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Detectar la redirección después de la autenticación de Google
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data?.session) {
        console.log('Session found, user is logged in');
      } else if (error) {
        console.error('Error checking session:', error.message);
      }
    };

    checkSession();

    // Suscribirse a cambios de autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change event:', event);
      if (event === 'SIGNED_IN' && session) {
        console.log('User signed in:', session.user.email);
      }
    });

    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Validar email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('El email es requerido');
      return false;
    } else if (!emailRegex.test(email)) {
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
    } else if (password.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    setPasswordError('');
    return true;
  };

  // Iniciar sesión con email y contraseña
  const handleLogin = async () => {
    // Validar campos
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error: any) {
      Alert.alert('Error al iniciar sesión', error.message || 'Ha ocurrido un error');
    } finally {
      setLoading(false);
    }
  };

  // Iniciar sesión con Google
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const provider = 'google';

      console.log('Redirect URI:', redirectUri);

      // Iniciar el proceso de autenticación con Google
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUri,
          skipBrowserRedirect: true, // Important for web
        },
      });

      if (error) throw error;

      // Abrir el navegador para autenticación
      if (data?.url) {
        console.log('Opening auth URL:', data.url);

        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectUri
        );

        console.log('Auth result:', result.type);

        if (result.type === 'success') {
          // En plataforma web, necesitamos procesar el código de autorización
          const { url } = result;
          if (url) {
            console.log('Success URL:', url);
            // Extraer el código de autorización de la URL
            const urlObj = new URL(url);
            const params = new URLSearchParams(urlObj.search);
            const code = params.get('code');

            if (code) {
              console.log('Authorization code received');

              // Con el código, podemos finalizar la autenticación
              const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code);

              if (sessionError) {
                console.error('Error exchanging code for session:', sessionError);
                throw sessionError;
              }

              console.log('Authentication successful');
            }
          }
        } else if (result.type !== 'cancel') {
          throw new Error('No se pudo autenticar con Google');
        }
      }
    } catch (error: any) {
      console.error('Google auth error:', error);
      Alert.alert('Error al iniciar sesión con Google', error.message || 'Ha ocurrido un error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../assets/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>SocialCommerce</Text>
        <Text style={styles.subtitle}>Conecta con comercios a través de videos</Text>
      </View>

      <View style={styles.formContainer}>
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

        <Button
          title="Iniciar Sesión"
          onPress={handleLogin}
          loading={loading}
          fullWidth
          style={styles.loginButton}
        />

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>O</Text>
          <View style={styles.dividerLine} />
        </View>

        <Button
          title="Iniciar Sesión con Google"
          onPress={handleGoogleLogin}
          loading={loading}
          variant="outline"
          fullWidth
          style={styles.googleButton}
          leftIcon={<Ionicons name="logo-google" size={20} color="#4285F4" />}
        />
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate('Register')}
        style={styles.registerLink}
      >
        <Text style={styles.registerText}>
          ¿No tienes una cuenta? <Text style={styles.registerHighlight}>Regístrate</Text>
        </Text>
      </TouchableOpacity>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  loginButton: {
    marginTop: 10,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E1E1E1',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#9E9E9E',
  },
  googleButton: {
    backgroundColor: '#fff',
  },
  registerLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
    color: '#666',
  },
  registerHighlight: {
    color: '#4285F4',
    fontWeight: 'bold',
  },
});

export default LoginScreen; 