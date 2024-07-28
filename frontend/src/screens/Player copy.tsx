import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import MusicPlayer from '../components/MusicPlayer'
import { RootState } from '../features/store'
import { useSelector } from 'react-redux'

export default function Player() {
  const { songs, currentSongIndex } = useSelector(
    (state: RootState) => state.player
  )
  if (!songs && !currentSongIndex) {
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
    marginTop: '6%',
    paddingHorizontal: 20,
  },
})
