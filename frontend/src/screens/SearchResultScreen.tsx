import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import TabButton from '../components/TabButton'
import { useAppDispatch, useAppSelector } from '../features/store'
import {
  searchArtists,
  searchSongs,
  selectSearch,
  setKeyword,
} from '../features/slices/searchSlice'
import SearchBar from '../components/SearchBar'
import ArtistsSearchList from '../components/search/ArtistsSearchList'
import SongsSearchList from '../components/search/SongsSearchList'
import { Colors } from '../constant/Colors'
import LoadingOverlay from '../components/LoadingOverlay'
import { setSongsPlay } from '../features/slices/playerSlice'

const SearchResultScreen = ({ route, navigation }) => {
  const [isSearchSong, setIsSearchSong] = useState(true)
  const { keyword, isLoading, isLoadingMore, artistsResult, songsResult } =
    useAppSelector(selectSearch)
  const dispatch = useAppDispatch()

  const {
    items: artists,
    pageNum: artistPageNum,
    totalItems: totalArtists,
    totalPages: artistTotalPages,
  } = artistsResult
  const {
    items: songs,
    pageNum: songPageNum,
    totalItems: totalSongs,
    totalPages: songTotalPages,
  } = songsResult

  const fetchInitialData = async () => {
    await Promise.all([
      dispatch(searchArtists({ keyword })).unwrap(),
      dispatch(searchSongs({ keyword })).unwrap(),
    ])
  }

  useEffect(() => {
    fetchInitialData()
  }, [keyword])

  const handleSearch = async (searchTerm: string) => {
    dispatch(setKeyword(searchTerm))
  }

  const handleSongsEndReached = () => {
    if (songPageNum < songTotalPages && !isLoadingMore) {
      dispatch(searchSongs({ keyword, pageNum: songPageNum + 1 }))
    }
  }
  const handleArtistsEndReached = () => {
    if (artistPageNum < artistTotalPages && !isLoadingMore) {
      dispatch(searchArtists({ keyword, pageNum: artistPageNum + 1 }))
    }
  }

  const handleSongPress = (currentIndex: number) => {
    dispatch(
      setSongsPlay({ songPage: songsResult, currentSongIndex: currentIndex })
    )
    navigation.navigate('Player')
  }

  if (isLoading) {
    return <LoadingOverlay visible={true} />
  }

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 10, marginTop: 24 }}>
        <SearchBar initKeyword={keyword} onSearch={handleSearch} />
        <View style={styles.buttonContainer}>
          <TabButton
            title="Songs"
            isActive={isSearchSong}
            onPress={() => setIsSearchSong(true)}
          />
          <TabButton
            title="Artists"
            isActive={!isSearchSong}
            onPress={() => setIsSearchSong(false)}
          />
        </View>
      </View>
      {isSearchSong ? (
        <>
          <Text style={styles.numberItems}>{totalSongs} kết quả tìm kiếm</Text>
          <SongsSearchList
            songs={songs}
            onEndReached={handleSongsEndReached}
            isLoadingMore={isLoadingMore}
            onPressItem={handleSongPress}
          />
        </>
      ) : (
        <>
          <Text style={styles.numberItems}>
            {totalArtists} kết quả tìm kiếm
          </Text>
          <ArtistsSearchList
            artists={artists}
            onEndReached={handleArtistsEndReached}
            isLoadingMore={isLoadingMore}
          />
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary800,
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  buttonContainer: {
    marginVertical: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 12,
  },
  numberItems: {
    color: '#fff',
    marginBottom: 12,
  },
})

export default SearchResultScreen
