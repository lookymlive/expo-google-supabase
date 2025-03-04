import React, { ReactNode } from 'react';
import { StyleProp, View, ViewProps, ViewStyle } from 'react-native';

interface SafeViewProps extends ViewProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  pointerEvents?: 'box-none' | 'none' | 'box-only' | 'auto';
}

/**
 * Componente SafeView que maneja correctamente pointerEvents y evita nodos de texto directos
 */
const SafeView: React.FC<SafeViewProps> = ({
  children,
  style,
  pointerEvents,
  ...props
}) => {
  // Asegurarnos de que los children no contienen nodos de texto directos
  const safeChildren = React.Children.map(children, child => {
    // Si es un string o número, lo convertimos a null para evitar errores
    if (typeof child === 'string' || typeof child === 'number') {
      console.warn('SafeView: Se eliminó un nodo de texto directo:', child);
      return null;
    }
    return child;
  });

  // Usar pointerEvents como parte del estilo en lugar de como prop directo
  const viewStyle = [
    style,
    pointerEvents ? { pointerEvents } : undefined
  ];

  // Remover pointerEvents de props para evitar la advertencia de deprecación
  const { pointerEvents: _, ...restProps } = props;

  return (
    <View style={viewStyle} {...restProps}>
      {safeChildren}
    </View>
  );
};

export default SafeView; 