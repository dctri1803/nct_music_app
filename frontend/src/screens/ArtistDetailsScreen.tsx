import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { Colors } from '../constant/Colors'
import ArtistInfo from '../components/ArtistInfo'
import SongList from '../components/SongList'
import { useAppDispatch, useAppSelector } from '../features/store'
import {
  changePageNum,
  fetchArtistSongs,
  selectArtistDetails,
} from '../features/slices/artistSlice'
import { useEffect } from 'react'
import Loading from '../components/Loading'
import { Artist } from '../models'
import Pagination from '../components/Pagination'
import { setSongsPlay } from '../features/slices/playerSlice'

function ArtistDetailsScreen({ navigation }) {
  const { artistId, songPage, isLoading, pageNum, pageSize } =
    useAppSelector(selectArtistDetails)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchArtistSongs({ artistId, pageNum, pageSize }))
  }, [artistId, pageNum, pageSize])

  const onPageChange = (page: number) => {
    dispatch(changePageNum(page))
  }

  const handlePressSong = (currentIndex: number) => {
    dispatch(
      setSongsPlay({ songPage: songPage, currentSongIndex: currentIndex })
    )
    navigation.navigate('Player')
  }

  if (isLoading) {
    return <Loading type="black" loadingSize="large" />
  }

  const artist: Artist = songPage?.items[0].artists.find(
    (a) => a.id === artistId
  )
  if (!artist) {
    return
  }

  const {
    items,
    pageNum: pageNumber,
    pageSize: pageSizeNum,
    totalPages,
    totalItems,
  } = songPage

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* <View style={styles.buttonContainer}>
          <BackButton />
        </View> */}
        <ArtistInfo artist={artist} />
        <SongList
          songs={items}
          totalItems={totalItems}
          onPress={handlePressSong}
        />
        {totalPages >= 2 && (
          <Pagination
            pageNum={pageNumber}
            pageSize={pageSizeNum}
            totalPages={totalPages}
            totalItems={totalItems}
            onPageChange={onPageChange}
          />
        )}
      </ScrollView>
    </View>
  )
}
export default ArtistDetailsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary800,
    paddingHorizontal: 16,
  },
  buttonContainer: {
    marginVertical: 8,
  },
})
