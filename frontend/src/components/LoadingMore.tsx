import { ActivityIndicator, View } from 'react-native'
import { Colors } from '../constant/Colors'

export default function LoadingMore() {
  return (
    <View style={{ padding: 10, alignItems: 'center' }}>
      <ActivityIndicator size="large" color={Colors.primary300} />
    </View>
  )
}
