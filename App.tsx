
import React, { Suspense, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import SearchScreen from './screens/SearchScreen';
import LoginScreen from './screens/LoginScreen';
import ProfileScreen from './screens/ProfileScreen';
import './i18n';
import {useTranslation} from "react-i18next";
import { LanguageProvider } from './LanguageContext';

const Tab = createBottomTabNavigator();
const HomeScreen = React.lazy(() => import('./screens/HomeScreen'));

const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { t, i18n } = useTranslation();
    const logout = () => {
        setIsLoggedIn(false);
    };
    return (
        <LanguageProvider>
        <Suspense fallback={<Text>{t('loading')}</Text>}>
            <NavigationContainer>
                {isLoggedIn ? (
                    <Tab.Navigator screenOptions={{ tabBarActiveTintColor: "blue" }}>
                        <Tab.Screen name={t('home')} component={HomeScreen} options={{ tabBarIcon: () => <Ionicons name="home" size={26} color="black" />}}/>
                        <Tab.Screen name={t('search')} component={SearchScreen} options={{ tabBarIcon: () => <FontAwesome name="search" size={26} color="black" />}}/>
                        <Tab.Screen
                            name={t('profile')}
                            children={() => <ProfileScreen logout={logout} />}
                            options={{ tabBarIcon: () => <Ionicons name="person" size={26} color="black" />}}
                        />
                    </Tab.Navigator>
                ) : (
                    <LoginScreen setIsLoggedIn={setIsLoggedIn} />
                )}
            </NavigationContainer>
        </Suspense>
        </LanguageProvider>
    );
};

export default App;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',

  },
  error: {
    fontWeight: "bold"
  }
});
