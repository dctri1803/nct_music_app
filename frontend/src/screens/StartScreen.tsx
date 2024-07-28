import { View, Text, StyleSheet } from 'react-native'
import Logo from '../components/Logo'

export default function StartScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Logo />
      <View style={styles.btn}>
        <Text
          style={{
            color: '#fff',
            fontWeight: 'bold',
            textAlign: 'center',
            paddingVertical: 15,
            paddingHorizontal: 118,
          }}
          onPress={() => navigation.navigate('SignupScreen')}
        >
          SIGN UP
        </Text>
      </View>
      <View style={styles.btn}>
        <Text
          style={{
            color: '#fff',
            fontWeight: 'bold',
            textAlign: 'center',
            paddingVertical: 15,
            paddingHorizontal: 118,
          }}
          onPress={() => navigation.navigate('LoginScreen')}
        >
          LOGIN
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    marginTop: 15,
    minWidth: 300,
    backgroundColor: '#000',
    borderRadius: 10,
  },
})
