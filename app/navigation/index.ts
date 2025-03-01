/**
 * Configuración de navegación principal
 */

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

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
