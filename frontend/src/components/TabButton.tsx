import { Pressable, View, Text, StyleSheet } from 'react-native'

const TabButton = ({ title, isActive, onPress }) => {
  return (
    <Pressable
      style={
        !isActive ? styles.button : [styles.button, { borderColor: '#321acf' }]
      }
      onPress={onPress}
    >
      <View>
        <Text
          style={
            !isActive
              ? styles.buttonText
              : [styles.buttonText, { color: '#321acf' }]
          }
        >
          {title}
        </Text>
      </View>
    </Pressable>
  )
}
export default TabButton

const styles = StyleSheet.create({
  button: {
    paddingVertical: 6,
    paddingHorizontal: 30,
    borderWidth: 1,
    borderColor: '#adb5bd',
    borderRadius: 25,
  },
  buttonText: {
    color: '#adb5bd',
    fontSize: 16,
    fontWeight: 'bold',
  },
})
