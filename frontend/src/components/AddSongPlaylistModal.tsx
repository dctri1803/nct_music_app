import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { Colors } from '../constant/Colors'
import { useEffect, useState } from 'react'
import { FontAwesome } from '@expo/vector-icons'
import { useAppDispatch, useAppSelector } from '../features/store'
import {
  addSongToPlaylist,
  createNewPlaylist,
  fetchUserPlaylists,
  removeSongFromPlaylist,
  selectPlaylist,
} from '../features/slices/playlistSlice'
import {
  checkLikedSongs,
  checkSongInPlaylists,
  selectPlayer,
} from '../features/slices/playerSlice'
import Loading from './Loading'
import Pagination from './Pagination'
import { Feather, AntDesign } from '@expo/vector-icons'
import { checkSongInPlaylistAPI } from '../apis/playlistService'
import AddPlaylistModal from './AddPlaylistModal'

export default function AddSongPlaylistModal({
  isModalVisible,
  closeModal,
  songId,
}) {
  const { userPlaylists, isLoading: changeLoading } =
    useAppSelector(selectPlaylist)
  const { isInPlaylist } = useAppSelector(selectPlayer)
  const [isLoading, setIsLoading] = useState(true)

  const dispatch = useAppDispatch()

  useEffect(() => {
    setIsLoading(true)
    dispatch(
      checkSongInPlaylists({ playlists: userPlaylists.items, songId: songId })
    )
    setIsLoading(false)
  }, [userPlaylists])

  const handleAddToPlaylist = (playlistId: number) => {
    dispatch(addSongToPlaylist({ playlistId: playlistId, songId: songId }))
  }

  const handleRemoveSongFromPlaylist = (playlistId: number) => {
    dispatch(removeSongFromPlaylist({ playlistId: playlistId, songId: songId }))
  }

  const handlePageChange = (page: number) => {
    dispatch(fetchUserPlaylists({ pageNum: page }))
  }

  // if (isLoading) {
  //   return (
  //     <Modal
  //       visible={isModalVisible}
  //       onRequestClose={closeModal}
  //       animationType="fade"
  //       transparent={true}
  //     >
  //       <View style={styles.modalView}>
  //         <Loading loadingSize="large" />
  //       </View>
  //     </Modal>
  //   )
  // }

  if (!userPlaylists.items || !isInPlaylist) {
    return
  }
  if (userPlaylists.items.length === 0) {
    return (
      <Modal
        visible={isModalVisible}
        onRequestClose={closeModal}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.modalView}>
          <Text style={{ color: '#fff', fontSize: 20 }}>
            Không có playlist nào
          </Text>
        </View>
      </Modal>
    )
  }
  return (
    <Modal
      visible={isModalVisible}
      onRequestClose={closeModal}
      animationType="fade"
      transparent={true}
    >
      <TouchableWithoutFeedback onPress={closeModal} style={{ flex: 1 }}>
        <View style={styles.modalView}>
          {changeLoading && <Loading loadingSize="large" />}
          {!changeLoading && (
            <ScrollView>
              <View>
                <View style={styles.header}>
                  <Pressable onPress={closeModal}>
                    <FontAwesome name="remove" size={24} color="#fff" />
                  </Pressable>
                </View>
                {userPlaylists.items.map((item, index) => (
                  <View key={item.id} style={styles.item}>
                    <View style={styles.itemBtn}>
                      <View>
                        <Text style={styles.text}>{item.name}</Text>
                        <Text style={styles.numberSongs}>
                          {item.totalSongs} bài hát
                        </Text>
                      </View>
                    </View>
                    {!isInPlaylist[index] ? (
                      <TouchableOpacity
                        style={styles.deleteBtn}
                        onPress={() => handleAddToPlaylist(item.id)}
                      >
                        <Feather name="square" size={24} color="white" />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.deleteBtn}
                        onPress={() => handleRemoveSongFromPlaylist(item.id)}
                      >
                        <AntDesign
                          name="checksquareo"
                          size={24}
                          color="white"
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
              {userPlaylists.totalPages >= 2 && (
                <Pagination
                  pageNum={userPlaylists.pageNum}
                  pageSize={userPlaylists.pageSize}
                  totalPages={userPlaylists.totalPages}
                  totalItems={userPlaylists.totalItems}
                  onPageChange={handlePageChange}
                />
              )}
            </ScrollView>
          )}
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalView: {
    width: '90%',
    minHeight: '70%',
    marginHorizontal: 'auto',
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary300,
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
  header: {
    marginLeft: 'auto',
    marginBottom: 20,
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
  itemBtn: {
    flexDirection: 'row',
    width: '60%',
    gap: 12,
    alignItems: 'center',
  },
  item: {
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  deleteBtn: {
    marginLeft: 20,
  },
  text: {
    color: '#fff',
    fontSize: 18,
    alignSelf: 'center',
    marginBottom: 4,
  },
  numberSongs: {
    color: Colors.gray500,
    fontSize: 14,
  },
})
