import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { Colors } from '../constant/Colors'
import { useState } from 'react'
import { useAppDispatch } from '../features/store'
import {
  createNewPlaylist,
  fetchUserPlaylists,
} from '../features/slices/playlistSlice'

export default function AddPlaylistModal({ isModalVisible, closeModal }) {
  const [playlistName, setPlaylistName] = useState('')
  const dispatch = useAppDispatch()

  const handleCreatePlayList = async () => {
    if (!playlistName) {
      Alert.alert('Error', 'Hãy nhập tên playlist')
    }
    dispatch(createNewPlaylist(playlistName))
      .unwrap()
      .then(() => {
        handleClose()
        dispatch(fetchUserPlaylists({ pageNum: 1 }))
        Alert.alert('Success', 'Thêm playlist thành công')
      })
      .catch((e) => {})
  }

  const handleClose = () => {
    setPlaylistName('')
    closeModal()
  }

  return (
    <Modal
      visible={isModalVisible}
      onRequestClose={handleClose}
      animationType="fade"
      transparent={true}
    >
      <View style={styles.modalView}>
        <TextInput
          placeholder="Tên playlist mới..."
          value={playlistName}
          onChangeText={(text) => setPlaylistName(text)}
          style={styles.input}
          placeholderTextColor="#fff"
        />
        <View style={styles.buttonsContainer}>
          <Pressable onPress={handleCreatePlayList}>
            <Text
              style={{
                ...styles.button,
                color: '#fff',
                paddingHorizontal: 20,
                paddingVertical: 10,
                fontWeight: 'bold',
              }}
            >
              Xác nhận
            </Text>
          </Pressable>
          <Pressable onPress={handleClose}>
            <Text
              style={{
                ...styles.button,
                color: '#fff',
                paddingHorizontal: 36,
                paddingVertical: 10,
                fontWeight: 'bold',
              }}
            >
              Hủy
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalView: {
    width: '90%',
    marginHorizontal: 'auto',
    marginTop: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary500,
    borderRadius: 20,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    marginBottom: 20,
    marginHorizontal: 'auto',
    padding: 10,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 5,
    width: '100%',
    color: '#fff',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  button: {
    alignSelf: 'center',
    borderRadius: 4,
    marginBottom: 10,
    backgroundColor: Colors.primary800,
  },
})
