import { Image, Text, View } from 'react-native'
import { Song } from '../models'
import { StyleSheet } from 'react-native'

function SongInfo({ song }: { song: Song }) {
  return (
    <View style={styles.songInfo}>
      <Image
        source={{ uri: song.imagePath }}
        style={styles.songImage}
        resizeMode="cover"
      />
      <Text style={styles.songName}>{song.name}</Text>
      <Text style={styles.songArtist}>{song.artists[0].name}</Text>
    </View>
  )
}
export default SongInfo

const styles = StyleSheet.create({
  songInfo: {
    alignItems: 'center',
  },
  songImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  songName: {
    color: '#fff',
    fontSize: 28,
    marginTop: 30,
  },
  songArtist: {
    opacity: 0.6,
    color: '#fff',
    marginTop: 10,
  },
})
