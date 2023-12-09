import { StyleSheet, Text, View } from 'react-native';
import React, { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SearchScreen from './screens/SearchScreen';
//import LoginScreen from './screens/LoginScreen';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const HomeScreen = React.lazy(() => import('./screens/HomeScreen'));

function ErrorFallback({ error }: { error: Error }) {
  return (
    <View>
      <Text>Something went wrong: </Text>
      <Text style={styles.error}>{error.message}</Text>
    </View>
  );
}
const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (

      //<ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<Text>Loading...</Text>}>
          <NavigationContainer>
            <Tab.Navigator screenOptions={{ tabBarActiveTintColor: "blue" }}>
              <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: () => <Ionicons name="home" size={26} color="black" />}}/>
              <Tab.Screen name="Search" component={SearchScreen} options={{ tabBarIcon: () => <FontAwesome name="search" size={26} color="black" />}}/>
            </Tab.Navigator>
          </NavigationContainer>
        </Suspense>
      //</ErrorBoundary>

  );
}

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
