import { useNavigation } from '@react-navigation/native'
import { Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export default function BackButton({ color = '#fff', size = 24 }) {
  const navigation = useNavigation()

  return (
    <Pressable onPress={() => navigation.goBack()}>
      <Ionicons name="arrow-back" size={size} color={color} />
    </Pressable>
  )
}
