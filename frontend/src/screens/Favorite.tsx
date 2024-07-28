import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { useAppDispatch, useAppSelector } from '../features/store'
import {
  deletePlaylist,
  fetchUserPlaylists,
  selectPlaylist,
} from '../features/slices/playlistSlice'
import LoadingOverlay from '../components/LoadingOverlay'
import { Colors } from '../constant/Colors'
import { AntDesign } from '@expo/vector-icons'
import AddPlaylistModal from '../components/AddPlaylistModal'
import Pagination from '../components/Pagination'

export default function Favorite({ navigation }) {
  const [isModalVisible, setIsModalVisible] = useState(false)

  const { userPlaylists, isLoading } = useAppSelector(selectPlaylist)
  const dispatch = useAppDispatch()

  const handleRemovePlaylist = (id: number, name: string) => {
    Alert.alert('Delete', `Bạn có chắc chắn muốn xoá playlist ${name} không?`, [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đồng ý',
        onPress: () => {
          dispatch(deletePlaylist(id))
            .unwrap()
            .then(() => {
              dispatch(fetchUserPlaylists({ pageNum: userPlaylists.pageNum }))
            })
            .catch((e) => {})
        },
      },
    ])
  }

  const handleGetSongsInPlaylist = async (id: number) => {
    navigation.navigate('PlaylistDetailsScreen', { playlistId: id })
  }

  const onPageChange = (page: number) => {
    dispatch(fetchUserPlaylists({ pageNum: page }))
  }

  const closeModal = () => {
    setIsModalVisible(false)
  }

  if (isLoading || !userPlaylists) {
    return <LoadingOverlay visible={true} />
  }

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }}>
        <AddPlaylistModal
          isModalVisible={isModalVisible}
          closeModal={closeModal}
        />
        <View style={styles.header}>
          <Text style={styles.title}>Thư viện</Text>

          <TouchableOpacity
            style={{ flexDirection: 'row' }}
            onPress={() => setIsModalVisible(true)}
          >
            <AntDesign name="pluscircleo" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.likeContainer}>
          <TouchableOpacity
            style={styles.itemBtn}
            onPress={() => handleGetSongsInPlaylist(0)}
          >
            <Image
              source={require('../assets/FavoriteAlbum.png')}
              style={styles.image}
            />
            <Text style={styles.text}>Yêu thích</Text>
          </TouchableOpacity>
        </View>
        {userPlaylists.items.map((item) => (
          <View key={item.id} style={styles.item}>
            <TouchableOpacity
              style={styles.itemBtn}
              onPress={() => handleGetSongsInPlaylist(item.id)}
            >
              <Image
                source={require('../assets/musicAlbum.jpg')}
                style={styles.image}
              />
              <View>
                <Text style={styles.text}>{item.name}</Text>
                <Text style={styles.numberSongs}>
                  {item.totalSongs} bài hát
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => handleRemovePlaylist(item.id, item.name)}
            >
              <FontAwesome name="remove" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}
        {userPlaylists.totalPages >= 2 && (
          <Pagination
            pageNum={userPlaylists.pageNum}
            pageSize={userPlaylists.pageSize}
            totalPages={userPlaylists.totalPages}
            totalItems={userPlaylists.totalItems}
            onPageChange={onPageChange}
          />
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary800,
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 80,
  },
  header: {
    flexDirection: 'row',
    marginTop: 32,
    marginBottom: 20,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  likeContainer: {
    marginTop: 24,
    marginBottom: 20,
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
