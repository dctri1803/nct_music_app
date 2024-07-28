import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { useAppDispatch, useAppSelector } from '../features/store'
import {
  changePageNum,
  fetchGenreSongs,
  selectGenreDetails,
} from '../features/slices/genreSlice'
import { useLayoutEffect } from 'react'
import { Colors } from '../constant/Colors'
import LoadingOverlay from '../components/LoadingOverlay'
import SongList from '../components/SongList'
import Pagination from '../components/Pagination'
import { setSongsPlay } from '../features/slices/playerSlice'

export default function GenreDetailsScreen({ navigation }) {
  const { genreId, genreName, pageNum, pageSize, songPage, isLoading } =
    useAppSelector(selectGenreDetails)
  const dispatch = useAppDispatch()

  useLayoutEffect(() => {
    dispatch(fetchGenreSongs({ genreId, pageNum, pageSize }))
  }, [genreId, pageNum, pageSize])

  const onPageChange = (page: number) => {
    dispatch(changePageNum(page))
  }

  const handlePressSong = (currentIndex: number) => {
    dispatch(
      setSongsPlay({ songPage: songPage, currentSongIndex: currentIndex })
    )
    navigation.navigate('Player')
  }

  if (isLoading || !songPage) {
    return <LoadingOverlay visible={true} />
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
      {/* <LoadingOverlay visible={isLoading || !songPage} /> */}
      <ScrollView>
        <Text style={styles.title}>
          Thể loại
          <Text style={styles.name}> {genreName}</Text>
        </Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary800,
    paddingHorizontal: 16,
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
