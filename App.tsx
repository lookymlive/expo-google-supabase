import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuth } from './app/hooks';
import { AuthStack, MainTab, NavigationContainer, Stack } from './app/navigation';

// Pantallas de autenticación
import LoginScreen from './app/screens/auth/LoginScreen';

// Pantallas principales
import FeedScreen from './app/screens/feed/FeedScreen';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    // Aquí podríamos mostrar una pantalla de carga
    return null;
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
                <MainTab.Navigator>
                  <MainTab.Screen name="Feed" component={FeedScreen} />
                  {/* Aquí se agregarán más pantallas */}
                </MainTab.Navigator>
              )}
            </Stack.Screen>
          </Stack.Navigator>
        ) : (
          // Usuario no autenticado - Mostrar navegación de autenticación
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Auth">
              {() => (
                <AuthStack.Navigator>
                  <AuthStack.Screen name="Login" component={LoginScreen} />
                  {/* Aquí se agregarán más pantallas de autenticación */}
                </AuthStack.Navigator>
              )}
            </Stack.Screen>
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
