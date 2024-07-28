import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { View, Text, Pressable, StyleSheet, LogBox } from 'react-native'
import Slider from '@react-native-community/slider'
import {
  AVPlaybackStatus,
  Audio,
  InterruptionModeAndroid,
  InterruptionModeIOS,
} from 'expo-av'
import {
  AntDesign,
  FontAwesome6,
  Feather,
  MaterialIcons,
} from '@expo/vector-icons'
import {
  likeSong,
  nextSong,
  prevSong,
  resetState,
  selectPlayer,
  setCurrentIndex,
  setDuration,
  setLoopingStatus,
  setPlayingState,
  setProgress,
  setShuffleStatus,
  unlikeSong,
} from '../features/slices/playerSlice'
import { useAppDispatch, useAppSelector } from '../features/store'
import { formatTime } from '../utils/formatHelper'
import {
  findNextSong,
  findPreviousSong,
  findSongIndex,
} from '../utils/songHelper'
import SongInfo from './SongInfo'
import AddSongPlaylistModal from './AddSongPlaylistModal'
import LoadingOverlay from './LoadingOverlay'

LogBox.ignoreLogs(['Possible Unhandled Promise Rejection'])
export default function MusicPlayer() {
  const [currentSound, setCurrentSound] = useState<Audio.Sound | null>(null)
  const [loading, setLoading] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)

  const {
    songPage,
    currentSongIndex,
    loopingStatus,
    isShuffle,
    progress,
    duration,
    isPlaying,
    shuffledSongs,
    isLikedSongs,
  } = useAppSelector(selectPlayer)
  const dispatch = useAppDispatch()
  const loopingStatusRef = useRef(loopingStatus)
  const isShuffleRef = useRef(isShuffle)


  const init = async () => {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      interruptionModeIOS: InterruptionModeIOS.DuckOthers,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
      playThroughEarpieceAndroid: false,
    })
  }

  useEffect(() => {
    LogBox.ignoreLogs(['Possible Unhandled Promise Rejection'])
    init()

    return currentSound
      ? () => {
          currentSound.unloadAsync()
        }
      : undefined
  }, [currentSound])

  useEffect(() => {
    loopingStatusRef.current = loopingStatus
  }, [loopingStatus])

  useEffect(() => {
    isShuffleRef.current = isShuffle
  }, [isShuffle])

  const loadSong = async (uri: string) => {
    setLoading(true)
    try {
      if (currentSound) {
        await currentSound.unloadAsync()
      }
      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: isPlaying }
      )
      setCurrentSound(sound)
    } catch (error) {
      console.error('Error loading sound:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (songPage && songPage.items[currentSongIndex]) {
      loadSong(songPage.items[currentSongIndex].url)
    }
    return () => {
      if (currentSound) {
        currentSound.unloadAsync()
      }
      dispatch(resetState())
    }
  }, [currentSongIndex, songPage])

  useEffect(() => {
    if (currentSound) {
      currentSound.setIsLoopingAsync(loopingStatus === 'song')
    }
  }, [loopingStatus, currentSound])

  const handleEndSong = async () => {
    if (loopingStatusRef.current === 'none') {
      dispatch(setPlayingState(false))
    } else if (loopingStatusRef.current === 'song') {
      dispatch(setPlayingState(true))
      await currentSound?.replayAsync()
    } else if (loopingStatusRef.current === 'list') {
      const currentSong = songPage.items[currentSongIndex]
      if (isShuffleRef.current) {
        const nextSong = findNextSong(shuffledSongs, currentSong)
        const nextIndex = findSongIndex(songPage.items, nextSong)
        dispatch(setCurrentIndex(nextIndex))
      } else {
        dispatch(nextSong())
      }
    }
  }

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      if (isPlaying) {
        dispatch(
          setProgress(status.positionMillis / (status.durationMillis || 1))
        )
        dispatch(setDuration(status.durationMillis || 0))

        if (status.positionMillis === status.durationMillis) {
          handleEndSong()
        }
      }
    }
  }

  useEffect(() => {
    if (currentSound) {
      currentSound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate)
    }
  }, [currentSound])

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentSound && isPlaying) {
        currentSound.getStatusAsync().then((status) => {
          if (status.isLoaded) {
            dispatch(
              setProgress(status.positionMillis / (status.durationMillis || 1))
            )
            dispatch(setDuration(status.durationMillis || 0))
          }
        })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [currentSound, isPlaying])

  const playPause = async () => {
    if (!currentSound || loading) return

    try {
      const status = await currentSound.getStatusAsync()

      if (status.isLoaded) {
        if (isPlaying) {
          await currentSound.pauseAsync()
          dispatch(setPlayingState(false))
        } else {
          if (
            status.didJustFinish ||
            status.positionMillis === status.durationMillis
          ) {
            await currentSound.setPositionAsync(0)
          }
          await currentSound.playAsync()
          dispatch(setPlayingState(true))
        }
      }
    } catch (error) {
      console.log('Error while playing or pausing the sound:', error)
    }
  }

  const handleNextSong = async () => {
    if (loading) return
    setLoading(true)
    if (currentSound) {
      await currentSound.unloadAsync()
    }
    const currentSong = songPage.items[currentSongIndex]
    if (isShuffleRef.current) {
      const nextSong = findNextSong(shuffledSongs, currentSong)
      const nextIndex = findSongIndex(songPage.items, nextSong)
      dispatch(setCurrentIndex(nextIndex))
    } else {
      dispatch(nextSong())
    }
    setLoading(false)
  }

  const handlePrevSong = async () => {
    if (loading) return
    setLoading(true)
    if (currentSound) {
      await currentSound.unloadAsync()
    }
    const currentSong = songPage.items[currentSongIndex]
    if (isShuffle) {
      const nextSong = findPreviousSong(shuffledSongs, currentSong)
      const nextIndex = findSongIndex(songPage.items, nextSong)
      dispatch(setCurrentIndex(nextIndex))
    } else {
      dispatch(prevSong())
    }
    setLoading(false)
  }

  const toggleLooping = () => {
    dispatch(setLoopingStatus(loopingStatus))
  }

  const toggleShuffle = () => {
    dispatch(setShuffleStatus(!isShuffle))
  }

  const handleLikeSong = (songId: number) => {
    dispatch(likeSong({ songId }))
  }

  const handleUnlikeSong = (songId: number) => {
    dispatch(unlikeSong({ songId }))
  }

  if (loading) {
    return <LoadingOverlay visible={true} />
  }

  if (!songPage || !songPage.items[currentSongIndex]) return null

  const songPlay = songPage.items[currentSongIndex]
  const isLike = isLikedSongs[currentSongIndex]

  return (
    <View style={styles.container}>
      <AddSongPlaylistModal
        isModalVisible={isModalVisible}
        closeModal={() => setIsModalVisible(false)}
        songId={songPlay.id}
      />
      {/* Song Info */}
      <SongInfo song={songPlay} />

      {/* Slider */}
      <View>
        <Slider
          style={styles.slider}
          minimumTrackTintColor={'#6156E2'}
          maximumTrackTintColor={'#fff'}
          thumbTintColor="#6156E2"
          minimumValue={0}
          maximumValue={1}
          value={progress}
          onValueChange={(value) => {
            dispatch(setProgress(value))
          }}
          onSlidingComplete={(value) => {
            if (currentSound) {
              const newPosition = value * duration
              currentSound.setPositionAsync(newPosition)
            }
          }}
        />
        <View style={styles.timeContainer}>
          <Text style={{ color: '#fff' }}>
            {formatTime(progress * duration)}
          </Text>
          <Text style={{ color: '#fff' }}> {formatTime(duration)}</Text>
        </View>
      </View>
      {/* Buttons */}
      <View>
        <View style={styles.topBtnContainer}>
          <Pressable onPress={toggleShuffle} disabled={loading}>
            <FontAwesome6
              name="shuffle"
              size={30}
              color={isShuffle ? '#fff' : 'rgba(255,255,255,0.5)'}
            />
          </Pressable>

          <Pressable onPress={handlePrevSong} disabled={loading}>
            <AntDesign name="stepbackward" size={30} color="#fff" />
          </Pressable>

          <Pressable onPress={playPause}>
            {isPlaying ? 
            <AntDesign
            name='pausecircle'
            size={30}
            color="#fff"
            onPress={playPause}
          />
            :
            <AntDesign
              name='caretright'
              size={30}
              color="#fff"
              onPress={playPause}
            />
            }
            
          </Pressable>

          <Pressable onPress={handleNextSong} disabled={loading}>
            <AntDesign name="stepforward" size={30} color="#fff" title="Next" />
          </Pressable>

          <Pressable
            onPress={toggleLooping}
            style={{
              position: 'relative',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            disabled={loading}
          >
            {loopingStatus === 'none' && (
              <AntDesign
                name="retweet"
                size={30}
                color="rgba(255,255,255,0.5)"
              />
            )}
            {loopingStatus === 'song' && (
              <AntDesign name="retweet" size={30} color="#fff" />
            )}
            {loopingStatus === 'list' && (
              <>
                <AntDesign name="retweet" size={30} color="#fff" />
                <Text style={styles.numberIcon}>1</Text>
              </>
            )}
          </Pressable>
        </View>
        <View style={styles.bottomBtnContainer}>
          {!isLike ? (
            <Pressable
              style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}
              onPress={() => {
                handleLikeSong(songPlay.id)
              }}
            >
              <AntDesign name="heart" size={30} color="rgba(255,255,255,0.5)" />
              <Text style={{ color: '#fff' }}>{songPlay.numberLikes}</Text>
            </Pressable>
          ) : (
            <Pressable
              style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}
              onPress={() => {
                handleUnlikeSong(songPlay.id)
              }}
            >
              <AntDesign name="heart" size={30} color="red" />
              <Text style={{ color: 'red' }}>{songPlay.numberLikes}</Text>
            </Pressable>
          )}
          <Pressable onPress={() => setIsModalVisible(true)}>
            <MaterialIcons
              name="playlist-add"
              size={30}
              color="rgba(255,255,255,0.5)"
            />
          </Pressable>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  slider: {
    marginTop: 20,
    width: 350,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeContainer: {
    width: '100%',
    flexDirection: 'row',
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  topBtnContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 30,
    marginBottom: 16,
  },
  numberIcon: {
    flex: 1,
    color: '#fff',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    fontSize: 10,
  },
  bottomBtnContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})
