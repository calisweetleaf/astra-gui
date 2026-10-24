import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';
import { JetBrainsMono_400Regular } from '@expo-google-fonts/jetbrains-mono';
import { SpaceGrotesk_500Medium } from '@expo-google-fonts/space-grotesk';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AgentProvider } from '../state/agent-store';
import { colors } from '../theme/tokens';

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    JetBrainsMono_400Regular,
    SpaceGrotesk_500Medium,
  });

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: colors.canvas, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      {fontError ? <Text style={{ color: colors.text }}>Astra could not load its bundled fonts: {fontError.message}</Text> : <ActivityIndicator color={colors.accent} />}
    </View>;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.canvas }}>
      <StatusBar style="light" />
      <SafeAreaProvider>
        <AgentProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.canvas },
            }}
          />
        </AgentProvider>
      </SafeAreaProvider>
    </View>
  );
}
