import { Text, View, Image, StyleSheet } from 'react-native'
import { Artist } from '../models'
import { Colors } from '../constant/Colors'

export default function ArtistInfo({ artist }: { artist: Artist }) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: artist.photo }} style={styles.image} />
      <View>
        <Text style={styles.title}>Ca sĩ</Text>
        <Text style={styles.name}>{artist.name}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 50,
  },
  title: {
    color: Colors.gray500,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  name: {
    color: '#fff',
    fontSize: 20,
  },
})
