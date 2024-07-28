import { Ionicons, Feather, MaterialIcons, AntDesign } from '@expo/vector-icons'
import {
  Player,
  Favorite,
  UserScreen,
  HomeScreen,
  SearchResultScreen,
  SongScreen,
  ArtistDetailsScreen,
  GenreDetailsScreen,
  UpdateProfileScreen,
  ChangePasswordScreen,
  PlaylistDetailsScreen,
} from '../screens'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Colors } from '../constant/Colors'

export const BottomNavigator = () => {
  const Tab = createBottomTabNavigator()

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.primary900,
          position: 'absolute',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderTopWidth: 0,
        },
        tabBarInactiveTintColor: '#fff',
        tabBarActiveTintColor: Colors.primary500,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Player"
        component={Player}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="music" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Favorite"
        component={Favorite}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="favorite-border" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="User"
        component={UserScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign name="user" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

const MainNavigator = () => {
  const Stack = createNativeStackNavigator()

  const screenWithBackButtonStyles = {
    headerShown: true,
    title: '',
    headerTintColor: '#fff',
    headerStyle: {
      backgroundColor: Colors.primary800,
    },
  }

  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="SearchResultScreen"
        component={SearchResultScreen}
        options={screenWithBackButtonStyles}
      />
      <Stack.Screen name="HomeScreen" component={BottomNavigator} />
      <Stack.Screen name="SongScreen" component={SongScreen} />
      <Stack.Screen
        name="ArtistDetailsScreen"
        component={ArtistDetailsScreen}
        options={screenWithBackButtonStyles}
      />
      <Stack.Screen
        name="GenreDetailsScreen"
        component={GenreDetailsScreen}
        options={screenWithBackButtonStyles}
      />
      <Stack.Screen
        name="UpdateProfileScreen"
        component={UpdateProfileScreen}
        options={screenWithBackButtonStyles}
      />
      <Stack.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
        options={screenWithBackButtonStyles}
      />
      <Stack.Screen
        name="PlaylistDetailsScreen"
        component={PlaylistDetailsScreen}
        options={screenWithBackButtonStyles}
      />
    </Stack.Navigator>
  )
}
export default MainNavigator
