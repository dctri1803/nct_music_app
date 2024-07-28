import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Song } from '../models'
import { Image } from 'react-native-elements'
import { Colors } from '../constant/Colors'

export default function SongList({
  songs,
  totalItems,
  onPress,
}: {
  songs: Song[]
  totalItems: number
  onPress: (currentIndex: number) => void
}) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bài hát</Text>
        <Text style={styles.numberSongs}>{totalItems} bài hát</Text>
      </View>
      <View>
        {songs.map((song, index) => (
          <Pressable
            style={styles.item}
            key={song.id}
            onPress={() => onPress(index)}
          >
            <Image source={{ uri: song.imagePath }} style={styles.image} />
            <View style={{ flex: 1 }}>
              <Text numberOfLines={2} ellipsizeMode="clip" style={styles.text}>
                {song.name}
              </Text>
              <Text style={styles.textReleasedOn}>{song.releasedOn}</Text>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    color: '#fff',
    fontSize: 18,
  },
  numberSongs: {
    color: Colors.gray500,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
    gap: 12,
  },
  image: {
    width: 60,
    height: 60,
  },
  text: {
    fontSize: 16,
    color: '#fff',
  },
  textReleasedOn: {
    marginTop: 4,
    color: '#ccc',
    fontSize: 12,
  },
})
