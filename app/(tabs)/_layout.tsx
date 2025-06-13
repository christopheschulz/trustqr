// app/_layout.tsx
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { IconSymbol } from '../../components/ui/IconSymbol';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarBackground: Platform.OS === 'ios' 
                    ? () => (
                        <BlurView
                            tint="systemChromeMaterial"
                            intensity={100}
                            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                        />
                    )
                    : undefined,
            }}
        >
            <Tabs.Screen 
                name="index" 
                options={{ 
                    title: "Scanner",
                    tabBarIcon: ({ color, size }) => (
                        <IconSymbol name="qrcode.viewfinder" color={color} size={size} />
                    ),
                    headerShown: false
                }} 
            />
            <Tabs.Screen 
                name="result" 
                options={{ 
                    title: "Résultat",
                    tabBarIcon: ({ color, size }) => (
                        <IconSymbol name="link" color={color} size={size} />
                    ),
                    headerShown: false
                }} 
            />
            <Tabs.Screen 
                name="settings" 
                options={{ 
                    title: "Paramètres",
                    tabBarIcon: ({ color, size }) => (
                        <IconSymbol name="gear" color={color} size={size} />
                    ),
                    headerShown: false
                }} 
            />
        </Tabs>
    );
}
