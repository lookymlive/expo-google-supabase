/**
 * Configuración de navegación principal
 */

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

// Pantallas
import { LoginScreen, RegisterScreen } from "../screens/auth";
import { FeedScreen, ProfileScreen } from "../screens/feed";

// Definición de tipos para los parámetros de navegación
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Feed: undefined;
  Upload: undefined;
  Profile: undefined;
};

// Creación de navegadores
export const Stack = createStackNavigator<RootStackParamList>();
export const AuthStack = createStackNavigator<AuthStackParamList>();
export const MainTab = createBottomTabNavigator<MainTabParamList>();

// Exportar NavigationContainer para su uso en App.tsx
export { NavigationContainer };

// Navegador de autenticación
export const AuthNavigator: React.FC = () => (
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
);

// Navegador principal
export const MainNavigator: React.FC = () => (
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

              return iconName ? <Ionicons name={iconName as any} size={size} color={color} /> : null;
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
);
