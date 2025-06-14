// app/_layout.tsx
import { Tabs } from 'expo-router';
import { useColorScheme, View } from 'react-native';
import { IconSymbol } from '../../components/ui/IconSymbol';
import { Colors } from '../../constants/Colors';

export default function TabLayout() {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    return (
        <Tabs
            screenOptions={{
                tabBarBackground: () => (
                    <View style={{ 
                        position: 'absolute', 
                        top: 0, 
                        left: 0, 
                        right: 0, 
                        bottom: 0,
                        backgroundColor: colors.background,
                    }} />
                ),
                tabBarActiveTintColor: colors.tint,
                tabBarInactiveTintColor: colors.tabIconDefault,
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
                    headerShown: false,
                    href: null
                }} 
            />
            <Tabs.Screen 
                name="verifications" 
                options={{ 
                    title: "Vérifications",
                    tabBarIcon: ({ color, size }) => (
                        <IconSymbol name="checkmark.shield" color={color} size={size} />
                    ),
                    headerShown: false,
                    href: null
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
