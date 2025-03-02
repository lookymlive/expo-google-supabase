import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuth } from './app/hooks';
import { AuthStack, MainTab, NavigationContainer, Stack } from './app/navigation';

// Pantallas de autenticación
import { LoginScreen, RegisterScreen } from './app/screens/auth';

// Pantallas principales
import FeedScreen from './app/screens/feed/FeedScreen';
import { ProfileScreen } from './app/screens/profile';

// Componente de carga
const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color="#4285F4" />
    <Text style={{ marginTop: 20 }}>Cargando...</Text>
  </View>
);

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />

        {user ? (
          // Usuario autenticado - Mostrar navegación principal
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Main">
              {() => (
                <MainTab.Navigator
                  screenOptions={({ route }) => ({
                    tabBarActiveTintColor: '#4285F4',
                    tabBarInactiveTintColor: 'gray',
                    tabBarLabelStyle: { fontSize: 12 },
                    tabBarStyle: { paddingBottom: 5 },
                    tabBarIcon: ({ focused, color, size }) => {
                      let iconName;

                      if (route.name === 'Feed') {
                        iconName = focused ? 'home' : 'home-outline';
                      } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                      }

                      return <Ionicons name={iconName as any} size={size} color={color} />;
                    },
                  })}
                >
                  <MainTab.Screen
                    name="Feed"
                    component={FeedScreen}
                    options={{
                      title: 'Feed',
                      headerShown: true,
                      headerTitle: 'SocialCommerce',
                      headerTitleStyle: { fontWeight: 'bold' }
                    }}
                  />
                  <MainTab.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{
                      title: 'Perfil',
                      headerShown: true,
                      headerTitleStyle: { fontWeight: 'bold' }
                    }}
                  />
                </MainTab.Navigator>
              )}
            </Stack.Screen>
          </Stack.Navigator>
        ) : (
          // Usuario no autenticado - Mostrar navegación de autenticación
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Auth">
              {() => (
                <AuthStack.Navigator
                  screenOptions={{
                    headerShown: true,
                    headerTitleStyle: { fontWeight: 'bold' },
                    headerTitleAlign: 'center'
                  }}
                >
                  <AuthStack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ title: 'Iniciar Sesión' }}
                  />
                  <AuthStack.Screen
                    name="Register"
                    component={RegisterScreen}
                    options={{ title: 'Crear Cuenta' }}
                  />
                </AuthStack.Navigator>
              )}
            </Stack.Screen>
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
