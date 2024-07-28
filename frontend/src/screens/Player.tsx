import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import MusicPlayer from '../components/MusicPlayer'
import { RootState, useAppDispatch } from '../features/store'
import { useSelector } from 'react-redux'
import { checkLikedSongs } from '../features/slices/playerSlice'
import LoadingOverlay from '../components/LoadingOverlay'

export default function Player() {
  const { songPage, currentSongIndex, isLikedSongs } = useSelector(
    (state: RootState) => state.player
  )
  const [isLoading, setIsLoading] = useState(true)
  const dispatch = useAppDispatch()

  useEffect(() => {
    setIsLoading(true)
    if (songPage) {
      dispatch(checkLikedSongs(songPage.items))
    }
    setIsLoading(false)
  }, [songPage])

  if (isLoading || !isLikedSongs || !songPage || !songPage.items) {
    return <LoadingOverlay visible={true} />
  }

  if (songPage.items.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'white' }}>No songs playing now</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <MusicPlayer />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A071E',
    paddingTop: 12,
    paddingHorizontal: 20,
  },
})
