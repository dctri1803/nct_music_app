import { StatusBar } from 'expo-status-bar'
import RootNavigator from './src/navigators/RootNavigator'
import { Provider } from 'react-redux'
import store from './src/features/store'
import { injectStore } from './src/utils/customFetch'
import { logoutUser } from './src/features/slices/authSlice'
import { LogBox } from 'react-native'

LogBox.ignoreLogs(['Warning: ...'])
injectStore(store, logoutUser)
export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <Provider store={store}>
        <RootNavigator />
      </Provider>
    </>
  )
}
