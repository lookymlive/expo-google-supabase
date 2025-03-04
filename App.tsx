import React, { Component, ErrorInfo, ReactNode, useEffect, useState } from 'react';
import { useAuth } from './app/hooks';
import { AuthNavigator, MainNavigator, NavigationContainer } from './app/navigation';
import { diagnoseSupabaseIssues, supabase } from './app/services/supabase';

// Pantallas de autenticación

// Pantallas principales

// Componentes UI
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LoadingScreen, SafeViewRoot } from './app/components/ui';

// Componente ErrorBoundary para capturar errores
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.log('Error en componente:', error);
    console.log('Error info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Algo salió mal</Text>
          <Text style={{ textAlign: 'center' }}>{this.state.error?.message}</Text>
        </View>
      );
    }

    return this.props.children;
  }
}

// Componente para depurar la autenticación
const DebugAuth = () => {
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [profileInfo, setProfileInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [diagnosticResults, setDiagnosticResults] = useState<any>(null);

  const checkSession = async () => {
    setLoading(true);
    setError(null);
    try {
      // Verificar sesión actual
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      setSessionInfo(sessionData?.session || null);

      if (sessionError) {
        throw new Error(`Error de sesión: ${sessionError.message}`);
      }

      if (sessionData?.session?.user) {
        // Verificar si existe el perfil
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", sessionData.session.user.id)
          .single();

        setProfileInfo(profileData || null);

        if (profileError) {
          if (profileError.code === 'PGRST116') {
            throw new Error(`No se encontró el perfil del usuario. Es posible que el disparador para crear perfiles automáticamente no esté funcionando.`);
          } else {
            throw new Error(`Error al obtener perfil: ${profileError.message}`);
          }
        }
      }
    } catch (e: any) {
      console.error("Error de depuración:", e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const resetSession = async () => {
    try {
      await supabase.auth.signOut();
      setSessionInfo(null);
      setProfileInfo(null);
      setError(null);
      setDiagnosticResults(null);
    } catch (e: any) {
      setError(`Error al cerrar sesión: ${e.message}`);
    }
  };

  const runDiagnostic = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await diagnoseSupabaseIssues();
      setDiagnosticResults(results);

      if (results.errors.length > 0) {
        setError(`Se encontraron ${results.errors.length} problemas. Ver detalles abajo.`);
      }
    } catch (e: any) {
      setError(`Error al ejecutar diagnóstico: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <ScrollView style={styles.debugContainer}>
      <Text style={styles.debugTitle}>Depuración de Autenticación</Text>

      {loading ? (
        <Text style={styles.loadingText}>Verificando...</Text>
      ) : (
        <>
          <View style={styles.debugSection}>
            <Text style={styles.sectionTitle}>Estado de Sesión:</Text>
            <Text style={styles.debugText}>
              {sessionInfo ? `✅ Usuario autenticado (${sessionInfo.user.email})` : '❌ No hay sesión activa'}
            </Text>
          </View>

          {sessionInfo && (
            <View style={styles.debugSection}>
              <Text style={styles.sectionTitle}>Información de Perfil:</Text>
              <Text style={styles.debugText}>
                {profileInfo ?
                  `✅ Perfil encontrado\nRol: ${profileInfo.role || 'No definido'}\nID: ${profileInfo.id.substring(0, 8)}...`
                  : '❌ No se encontró perfil'}
              </Text>
            </View>
          )}

          {diagnosticResults && (
            <View style={styles.debugSection}>
              <Text style={styles.sectionTitle}>Resultados del Diagnóstico:</Text>
              <Text style={styles.debugText}>
                Conexión: {diagnosticResults.connection ? '✅ OK' : '❌ Error'}{'\n'}
                Autenticación: {diagnosticResults.auth ? '✅ OK' : '❌ Error'}{'\n'}
                Perfil: {diagnosticResults.profile ? '✅ OK' : '❌ Error'}{'\n'}
                Tablas:{'\n'}
                - Profiles: {diagnosticResults.tables.profiles ? '✅ OK' : '❌ Error'}{'\n'}
                - Videos: {diagnosticResults.tables.videos ? '✅ OK' : '❌ Error'}{'\n'}
              </Text>

              {diagnosticResults.errors.length > 0 && (
                <View style={styles.errorsContainer}>
                  <Text style={styles.sectionTitle}>Errores Detectados:</Text>
                  {diagnosticResults.errors.map((err: string, index: number) => (
                    <Text key={index} style={styles.errorItem}>• {err}</Text>
                  ))}
                </View>
              )}
            </View>
          )}

          {error && (
            <View style={styles.errorSection}>
              <Text style={styles.errorTitle}>Error:</Text>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <Button title="Verificar Sesión" onPress={checkSession} color="#4285F4" />
            <View style={{ width: 10 }} />
            <Button title="Diagnóstico" onPress={runDiagnostic} color="#34A853" />
            <View style={{ width: 10 }} />
            <Button title="Cerrar Sesión" onPress={resetSession} color="#EA4335" />
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default function App() {
  const { user, loading } = useAuth();
  const [showDebug, setShowDebug] = useState(false);

  // Habilitar modo depuración cuando hay problemas
  useEffect(() => {
    if (!loading && !user) {
      // Verificar si hubo una sesión previa que se perdió
      const checkPreviousAuth = async () => {
        const { data } = await supabase.auth.getSession();
        if (data?.session) {
          console.log("Hay una sesión pero useAuth no la detectó correctamente");
          setShowDebug(true);
        }
      };

      checkPreviousAuth();
    }
  }, [loading, user]);

  if (loading) {
    return (
      <SafeViewRoot>
        <LoadingScreen message="Iniciando SocialCommerce..." />
      </SafeViewRoot>
    );
  }

  return (
    <SafeViewRoot>
      <ErrorBoundary>
        {!user ? (
          <>
            {showDebug ? (
              <DebugAuth />
            ) : (
              <NavigationContainer>
                <AuthNavigator />
              </NavigationContainer>
            )}
          </>
        ) : (
          <NavigationContainer>
            <MainNavigator />
          </NavigationContainer>
        )}
      </ErrorBoundary>
    </SafeViewRoot>
  );
}

const styles = StyleSheet.create({
  debugContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  debugTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  debugSection: {
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    elevation: 2,
    boxShadow: '0 2px 3px rgba(0, 0, 0, 0.1)',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  debugText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  errorSection: {
    marginBottom: 20,
    backgroundColor: '#ffebee',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#d32f2f',
  },
  errorText: {
    fontSize: 14,
    color: '#c62828',
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    flexWrap: 'wrap',
    gap: 10,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  debugButtonContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 999,
  },
  errorsContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 6,
  },
  errorItem: {
    fontSize: 13,
    color: '#d32f2f',
    marginBottom: 5,
  },
});
