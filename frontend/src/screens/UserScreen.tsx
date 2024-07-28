import React from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { useAppDispatch, useAppSelector } from '../features/store'
import { logoutUser } from '../features/slices/authSlice'
import { selectUser } from '../features/slices/userSlice'
import { Colors } from '../constant/Colors'
import LoadingOverlay from '../components/LoadingOverlay'

const UserScreen = ({ navigation }) => {
  const { profile, isLoading } = useAppSelector(selectUser)
  const dispatch = useAppDispatch()

  const handleLogout = () => {
    Alert.alert('Logout', 'Bạn có chắc chắn muốn đăng xuất không?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đồng ý',
        onPress: () => {
          dispatch(logoutUser())
        },
      },
    ])
  }

  if (isLoading) {
    return <LoadingOverlay visible={true} />
  }
  if (!profile) return

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: profile.photo }}
          style={{ width: 100, height: 100, borderRadius: 10 }}
        />

        <View>
          <Text style={{ ...styles.text, fontSize: 20, paddingTop: 4 }}>
            {profile.name}
          </Text>
          <Text style={{ ...styles.text, opacity: 0.6, paddingTop: 4 }}>
            {profile.email}
          </Text>
        </View>
      </View>
      <View>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate('UpdateProfileScreen')}
        >
          <Text style={styles.btnText}>Chỉnh sửa hồ sơ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate('ChangePasswordScreen')}
        >
          <Text style={styles.btnText}>Đổi mật khẩu</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.btn,
            {
              backgroundColor: Colors.primary500,
              borderColor: Colors.primary500,
            },
          ]}
          onPress={handleLogout}
        >
          <Text style={styles.btnText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A071E',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  header: {
    flexDirection: 'row',
    marginTop: 24,
    marginBottom: 50,
    paddingHorizontal: 12,
    gap: 12,
  },
  text: {
    color: '#fff',
    paddingHorizontal: 10,
  },
  btn: {
    width: '90%',
    marginTop: 15,
    backgroundColor: '#0A071E',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginHorizontal: 'auto',
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
})

export default UserScreen
