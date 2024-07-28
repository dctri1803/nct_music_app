import { NavigationContainer } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import AuthNavigator from './AuthNavigator'
import MainNavigator from './MainNavigator'
import { useAppDispatch, useAppSelector } from '../features/store'
import { fetchTokenFromStorage, selectAuth } from '../features/slices/authSlice'
import Loading from '../components/Loading'

const RootNavigator = () => {
  const [isLoading, setIsLoading] = useState(true)
  const { token } = useAppSelector(selectAuth)
  const dispatch = useAppDispatch()

  useEffect(() => {
    setIsLoading(true)
    dispatch(fetchTokenFromStorage())
    setIsLoading(false)
  }, [dispatch])

  if (isLoading) {
    return <Loading type="black" loadingSize="large" />
  }
  return (
    <NavigationContainer>
      {!token ? <AuthNavigator /> : <MainNavigator />}
    </NavigationContainer>
  )
}
export default RootNavigator
