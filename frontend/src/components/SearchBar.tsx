import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import { EvilIcons } from '@expo/vector-icons'
import { useState } from 'react'

const SearchBar = ({ initKeyword, onSearch, reset = false }) => {
  const [searchTerm, setSearchTerm] = useState(initKeyword)

  const handleSearch = async () => {
    if (!searchTerm) return

    onSearch(searchTerm)
    if (reset) {
      setSearchTerm('')
    }
  }

  return (
    <View style={styles.searchContainer}>
      <TouchableOpacity onPress={handleSearch}>
        <EvilIcons name="search" size={28} color="#fff" padding={10} />
      </TouchableOpacity>
      <TextInput
        autoCapitalize="none"
        placeholder="Search songs or artists"
        placeholderTextColor="#fff"
        style={styles.searchInput}
        value={searchTerm}
        onChangeText={setSearchTerm}
        onSubmitEditing={handleSearch}
      />
    </View>
  )
}
export default SearchBar

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 20,
    width: '100%',
    alignSelf: 'center',
  },
  searchInput: {
    padding: 10,
    paddingLeft: -5,
    color: '#fff',
    width: '100%',
  },
})
