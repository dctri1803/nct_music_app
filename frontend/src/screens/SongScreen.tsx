import React, { useState } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useSelector } from 'react-redux'
import { RootState } from '../features/store'
import Loading from '../components/Loading'

export default function SongScreen({ navigation }) {
  const {
    items: songs,
    heading,
    isLoading,
  } = useSelector((state: RootState) => state.songs)

  if (isLoading) {
    return <Loading style={{ backgroundColor: 'black' }} />
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={{ marginBottom: 10 }}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{heading}</Text>
        {songs.map((song) => (
          <TouchableOpacity style={styles.item} key={song.id}>
            <Image source={{ uri: song.imagePath }} style={styles.image} />
            <View>
              <Text style={styles.text}>{song.name}</Text>
              <Text style={styles.textReleasedOn}>{song.releasedOn}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0A071E',
    flex: 1,
    padding: 20,
    marginTop: '6%',
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    gap: 12,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  text: {
    fontSize: 18,
    color: '#fff',
  },
  textReleasedOn: {
    marginTop: 4,
    color: '#ccc',
    fontSize: 14,
  },
})
