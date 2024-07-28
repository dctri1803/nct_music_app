import React, { useState, useEffect } from 'react'
import { View, Text, Image } from 'react-native'
import Slider from '@react-native-community/slider'
import { AVPlaybackStatusSuccess, Audio } from 'expo-av'
import { AntDesign, FontAwesome6 } from '@expo/vector-icons'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../features/store'
import { nextSong, prevSong } from '../features/slices/playerSlice'

export default function MusicPlayer() {
  const [currentSound, setCurrentSound] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isLooping, setIsLooping] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)

  // const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const { songs, currentSongIndex } = useSelector(
    (state: RootState) => state.player
  )
  const dispatch = useDispatch()

  useEffect(() => {
    loadSong(songs[currentSongIndex].url)
  }, [songs, currentSongIndex])

  useEffect(() => {
    if (currentSound) {
      currentSound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate)
    }
  }, [currentSound])

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentSound && isPlaying) {
        currentSound.getStatusAsync().then((status) => {
          if (status.isLoaded && !status.isLooping) {
            setProgress(status.positionMillis / status.durationMillis)
            setDuration(status.durationMillis)
          }
        })
      }
    }, 1000) // Update every 1 second

    return () => clearInterval(interval)
  }, [currentSound, isPlaying])

  const loadSong = async (uri: string) => {
    const { sound } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: isPlaying }
    )
    setCurrentSound(sound)
  }

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded && !status.isLooping) {
      setProgress(status.positionMillis / status.durationMillis)
      setDuration(status.durationMillis)
    }
  }

  const playPause = async () => {
    if (!currentSound) return
    if (isPlaying) {
      await currentSound.pauseAsync()
      setIsPlaying(false)
    } else {
      await currentSound.playAsync()
      setIsPlaying(true)
    }
  }

  const handleNextSong = async () => {
    await currentSound.unloadAsync()
    dispatch(nextSong())
  }

  const handlePrevSong = async () => {
    await currentSound.unloadAsync()
    dispatch(prevSong())
  }

  const toggleLooping = () => {
    // setIsLooping(!isLooping);
  }

  const toggleShuffle = () => {
    // setIsShuffle(!isShuffle);
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60000)
    const seconds = (time % 60000) / 1000
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds.toFixed(0)}`
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Image
        source={{ uri: songs[currentSongIndex]?.imagePath }}
        style={{ width: 200, height: 200, borderRadius: 10 }}
        resizeMode="cover"
      />
      <Text style={{ color: '#fff', fontSize: 28, marginTop: 30 }}>
        {songs[currentSongIndex]?.name}
      </Text>
      <Text
        style={{ opacity: 0.6, color: '#fff', fontSize: 16, marginTop: 10 }}
      >
        {songs[currentSongIndex]?.artists[0].name}
      </Text>

      <Slider
        style={{ marginTop: 20, width: 350 }}
        minimumTrackTintColor={'#6156E2'}
        maximumTrackTintColor={'#fff'}
        thumbTintColor="#6156E2"
        minimumValue={0}
        maximumValue={1}
        value={progress}
        onValueChange={(value) => {
          setProgress(value)
        }}
        onSlidingComplete={(value) => {
          if (currentSound) {
            const newPosition = value * duration
            currentSound.setPositionAsync(newPosition)
          }
        }}
      />
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Text style={{ color: '#fff' }}>{formatTime(progress * duration)}</Text>
        <Text style={{ color: '#fff' }}> {formatTime(duration)}</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          alignContent: 'space-around',
          justifyContent: 'space-around',
          marginTop: 30,
        }}
      >
        <FontAwesome6
          name="shuffle"
          size={28}
          color={isShuffle ? '#fff' : 'rgba(255,255,255,0.5)'}
          onPress={toggleShuffle}
        />
        <AntDesign
          name="stepbackward"
          size={28}
          color="#fff"
          onPress={handlePrevSong}
        />
        <AntDesign
          name={isPlaying ? 'pausecircle' : 'caretright'}
          size={28}
          color="#fff"
          onPress={playPause}
        />
        <AntDesign
          name="stepforward"
          size={28}
          color="#fff"
          title="Next"
          onPress={handleNextSong}
        />
        <AntDesign
          name="retweet"
          size={28}
          color={isLooping ? '#fff' : 'rgba(255,255,255,0.5)'}
          onPress={toggleLooping}
        />
      </View>
    </View>
  )
}
