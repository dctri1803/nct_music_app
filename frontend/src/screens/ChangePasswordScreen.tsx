import {
  TextInput,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native'
import { Colors } from '../constant/Colors'
import Button from '../components/Button'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../features/store'
import { changeUserPassword, selectUser } from '../features/slices/userSlice'
import { ChangePwdRequest } from '../models'

export default function ChangePasswordScreen({ navigation }) {
  const [changePwdRequest, setPwdRequest] = useState<ChangePwdRequest>({
    currentPassword: 'nam12345',
    newPassword: 'nam123456',
    confirmationPassword: 'nam123456',
  })

  const { isLoading } = useAppSelector(selectUser)

  const dispatch = useAppDispatch()

  const handleInputChange = (field: keyof ChangePwdRequest, value: string) => {
    setPwdRequest((prevRequest) => ({
      ...prevRequest,
      [field]: value,
    }))
  }

  const handleSubmit = () => {
    const { currentPassword, newPassword, confirmationPassword } =
      changePwdRequest
    if (!currentPassword || !newPassword || !confirmationPassword) return
    if (currentPassword === newPassword) {
      Alert.alert('Error', 'Mật khẩu mới giống mật khẩu cũ!')
      return
    }
    if (newPassword !== confirmationPassword) {
      Alert.alert('Error', 'Mật khẩu không giống nhau!')
      return
    }

    dispatch(changeUserPassword(changePwdRequest))
      .unwrap()
      .then(() => {
        navigation.goBack()
        Alert.alert('Success', 'Thay đổi mật khẩu thành công')
      })
      .catch((e) => {})
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Đổi mật khẩu</Text>
        <View>
          <TextInput
            style={styles.input}
            placeholder="Nhập mật khẩu cũ"
            placeholderTextColor="#fff"
            value={changePwdRequest.currentPassword}
            onChangeText={(text) => handleInputChange('currentPassword', text)}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Nhập mật khẩu mới"
            placeholderTextColor="#fff"
            value={changePwdRequest.newPassword}
            onChangeText={(text) => handleInputChange('newPassword', text)}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Xác nhận mật khẩu mới"
            placeholderTextColor="#fff"
            value={changePwdRequest.confirmationPassword}
            onChangeText={(text) =>
              handleInputChange('confirmationPassword', text)
            }
            secureTextEntry
          />
          <View style={styles.buttonsContainer}>
            <Button onPress={handleSubmit} disabled={isLoading}>
              Lưu
            </Button>
            <Button
              onPress={() => {
                navigation.goBack()
              }}
              isPrimaryBtn={false}
            >
              Huỷ bỏ
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary800,
    paddingHorizontal: 16,
  },
  title: {
    color: Colors.primary500,
    fontWeight: 'bold',
    marginHorizontal: 'auto',
    fontSize: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 30,
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#0A071E',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 15,
    marginHorizontal: 'auto',
    borderWidth: 1,
    borderColor: '#fff',
    color: '#fff',
    width: '90%',
  },
  buttonsContainer: {
    marginTop: 24,
    flexDirection: 'row',
    marginHorizontal: 'auto',
    gap: 12,
  },
})
