import { Modal, View } from 'react-native'
import Loading from './Loading'

export default function LoadingOverlay({ visible }) {
  return (
    <View style={{ flex: 1 }}>
      <Modal visible={visible} transparent>
        <View style={{ flex: 1 }}>
          <Loading type="black" loadingSize="large" />
        </View>
      </Modal>
    </View>
  )
}
