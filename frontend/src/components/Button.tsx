import { Pressable, View, Text, StyleSheet } from 'react-native'
import { Colors } from '../constant/Colors'
import Loading from './Loading'

interface ButtonProps {
  children: string
  onPress: () => void
  disabled?: boolean
  isPrimaryBtn?: boolean
}
export default function Button({
  children,
  onPress,
  disabled = false,
  isPrimaryBtn = true,
}: ButtonProps) {
  return (
    <View
      style={
        !disabled
          ? [styles.container, !isPrimaryBtn && styles.secondButton]
          : [styles.container, styles.containerDisabled]
      }
    >
      <Pressable
        onPress={onPress}
        style={({ pressed }) =>
          pressed
            ? [styles.innerContainer, styles.pressed]
            : styles.innerContainer
        }
        android_ripple={{ color: Colors.primary500 }}
        disabled={disabled}
      >
        <Text style={styles.text}>{!disabled ? children : <Loading />}</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary300,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  secondButton: {
    backgroundColor: null,
    borderWidth: 1,
    borderColor: Colors.primary300,
  },
  containerDisabled: {
    backgroundColor: Colors.gray500,
  },
  innerContainer: {
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  pressed: {
    opacity: 0.75,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
})
