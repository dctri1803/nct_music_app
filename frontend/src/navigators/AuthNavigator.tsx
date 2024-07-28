import { StartScreen, LoginScreen, SignupScreen } from '../screens'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName='StartScreen'
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="StartScreen" component={StartScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignupScreen" component={SignupScreen} />
    </Stack.Navigator>
  )
}
export default AuthNavigator