import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Song } from '../../models'
import LoadingMore from '../LoadingMore'

interface SongsSearchListProps {
  songs: Song[]
  onEndReached: () => void
  isLoadingMore: boolean
  onPressItem: (currentIndex: number) => void
}
const SongsSearchList = ({
  songs,
  onEndReached,
  isLoadingMore,
  onPressItem,
}: SongsSearchListProps) => {
  return (
    <FlatList
      data={songs}
      keyExtractor={(item) => item.id.toString()}
      ListEmptyComponent={
        <View style={styles.container}>
          <Text style={{ color: 'white', fontSize: 20, textAlign: 'center' }}>
            No Songs Found
          </Text>
        </View>
      }
      ListFooterComponent={isLoadingMore ? <LoadingMore /> : null}
      renderItem={({ item, index }) => (
        <TouchableOpacity
          style={styles.item}
          onPress={() => onPressItem(index)}
        >
          <Image source={{ uri: item.imagePath }} style={styles.image} />
          <View>
            <Text style={styles.text}>{item.name}</Text>
            <Text style={{ color: '#ccc' }}>
              {item.artists.map((artist) => artist.name).join(', ')}
            </Text>
          </View>
        </TouchableOpacity>
      )}
      style={styles.container}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      initialNumToRender={4}
    />
  )
}
export default SongsSearchList

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 32,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    color: '#fff',
  },
})
