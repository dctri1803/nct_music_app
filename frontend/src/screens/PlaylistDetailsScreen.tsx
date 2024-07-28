import { ScrollView, View, Text } from 'react-native'
import {
  fetchSongsInPlaylist,
  selectPlaylist,
} from '../features/slices/playlistSlice'
import { useAppDispatch, useAppSelector } from '../features/store'
import { StyleSheet } from 'react-native'
import { Colors } from '../constant/Colors'
import SongList from '../components/SongList'
import Pagination from '../components/Pagination'
import { useEffect } from 'react'
import Loading from '../components/Loading'
import { Playlist } from '../models'
import { setSongsPlay } from '../features/slices/playerSlice'

export default function PlaylistDetailsScreen({ route, navigation }) {
  const { songsInPlaylist, isDetailsLoading, userPlaylists } =
    useAppSelector(selectPlaylist)

  const { playlistId } = route.params
  let playlist: Playlist = null
  if (playlistId > 0) {
    playlist = userPlaylists.items.find((list) => list.id === playlistId)
  }
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchSongsInPlaylist({ playlistId: playlistId }))
  }, [playlistId])

  const handlePageChange = (page: number) => {
    dispatch(fetchSongsInPlaylist({ playlistId: playlistId, pageNum: page }))
  }

  const handleSongPress = (currentIndex: number) => {
    dispatch(
      setSongsPlay({
        songPage: songsInPlaylist,
        currentSongIndex: currentIndex,
      })
    )
    navigation.navigate('Player')
  }

  if (!songsInPlaylist || isDetailsLoading) {
    return <Loading type="black" loadingSize="large" />
  }

  const playlistName = playlistId === 0 ? 'Danh sách yêu thích' : playlist.name

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>
          <Text style={styles.name}>{playlistName}</Text>
        </Text>
        {songsInPlaylist.items.length > 0 ? (
          <SongList
            songs={songsInPlaylist.items}
            totalItems={songsInPlaylist.totalItems}
            onPress={handleSongPress}
          />
        ) : (
          <Text style={styles.noItems}>Chưa có bài hát nào</Text>
        )}

        {songsInPlaylist.totalPages >= 2 && (
          <Pagination
            pageNum={songsInPlaylist.pageNum}
            pageSize={songsInPlaylist.pageSize}
            totalPages={songsInPlaylist.totalPages}
            totalItems={songsInPlaylist.totalItems}
            onPageChange={handlePageChange}
          />
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary800,
    paddingHorizontal: 16,
  },
  noItems: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 20,
    width: '80%',
    marginHorizontal: 'auto',
    marginTop: '50%',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 24,
  },
  name: {
    color: Colors.primary300,
  },
})
