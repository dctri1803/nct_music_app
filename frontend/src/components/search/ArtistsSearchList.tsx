import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../features/store'
import { useNavigation } from '@react-navigation/native'
import { Artist } from '../../models'
import LoadingMore from '../LoadingMore'
import { setArtistDetailsId } from '../../features/slices/artistSlice'

interface ArtistsSearchListProps {
  artists: Artist[]
  onEndReached: () => void
  isLoadingMore: boolean
}

const ArtistsSearchList = ({
  artists,
  onEndReached,
  isLoadingMore,
}: ArtistsSearchListProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigation = useNavigation()

  const handleGetArtistDetails = (id: number) => {
    dispatch(setArtistDetailsId(id))
    navigation.navigate('ArtistDetailsScreen' as never)
  }

  return (
    <FlatList
      data={artists}
      keyExtractor={(item) => item.id.toString()}
      ListEmptyComponent={
        <View style={styles.container}>
          <Text style={{ color: 'white', fontSize: 20, textAlign: 'center' }}>
            No Artists Found
          </Text>
        </View>
      }
      ListFooterComponent={isLoadingMore ? <LoadingMore /> : null}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.item}
          onPress={() => handleGetArtistDetails(item.id)}
        >
          <Image source={{ uri: item.photo }} style={styles.image} />
          <Text style={styles.text}>{item.name}</Text>
        </TouchableOpacity>
      )}
      style={styles.container}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      initialNumToRender={4}
    />
  )
}
export default ArtistsSearchList

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    color: '#fff',
  },
})
