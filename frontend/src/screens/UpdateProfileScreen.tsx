import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { UpdateUser } from '../models'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../features/store'
import { selectUser, updateUserProfile } from '../features/slices/userSlice'
import { Colors } from '../constant/Colors'
import Button from '../components/Button'
import { getImageExtension, getImageMimeType } from '../utils/imageHelper'

export default function UpdateProfileScreen({ navigation }) {
  const { profile, isLoading } = useAppSelector(selectUser)
  const [updatedUser, setUpdatedUser] = useState<UpdateUser>({
    name: profile.name,
    photo: profile.photo,
  })

  const dispatch = useAppDispatch()

  const handleInputChange = (field: keyof UpdateUser, value: string) => {
    setUpdatedUser((prevUser) => ({
      ...prevUser,
      [field]: value,
    }))
  }

  const handleImageSelection = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Permission to access media library denied')
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      })

      if (!result.canceled && result.assets.length > 0) {
        const selectedImage = result.assets[0]
        console.log(selectedImage)
        handleInputChange('photo', selectedImage.uri)
      } else {
        console.log('Image selection canceled or URI is undefined')
      }
    } catch (error) {
      Alert.alert('Error selecting image:', error)
    }
  }

  const handleSubmit = async () => {
    const { name, photo } = updatedUser
    if (name === profile.name && photo === profile.photo) return

    const formData = new FormData()
    if (name.trim().length < 3) {
      Alert.alert('Error', 'Tên phải ít nhất 3 kí tự!')
      return
    }
    if (name !== profile.name) {
      formData.append('name', name)
    }

    if (photo !== profile.photo) {
      const imgExtension = getImageExtension(photo)
      const imgType = getImageMimeType(imgExtension)
      if (imgType === 'unknown') {
        Alert.alert('Error', 'Chỉ có thể update ảnh định dạng jpg or png!')
        return
      }
      //@ts-ignore
      formData.append('photoFile', {
        uri: photo,
        type: imgType,
        name: 'update-img.' + imgExtension,
      })
    }
    dispatch(updateUserProfile(formData))
      .unwrap()
      .then(() => {
        navigation.goBack()
      })
      .catch((e) => {})
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Cập nhật thông tin</Text>
        <View>
          <View style={styles.imgContainer}>
            <TouchableOpacity onPress={handleImageSelection}>
              <Image source={{ uri: updatedUser.photo }} style={styles.img} />
              <FontAwesome
                name="pencil-square-o"
                size={24}
                color="#fff"
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
          <TextInput
            placeholder="Nhập tên nếu bạn muốn thay đổi..."
            placeholderTextColor={'#fff'}
            value={updatedUser.name}
            onChangeText={(text) => handleInputChange('name', text)}
            style={styles.textInput}
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
    marginBottom: 30,
  },
  imgContainer: {
    marginBottom: 24,
    alignItems: 'center',
    position: 'relative',
  },
  img: {
    width: 150,
    height: 150,
  },
  icon: {
    position: 'absolute',
    zIndex: 10,
    bottom: 0,
    right: 0,
  },
  textInput: {
    marginHorizontal: 'auto',
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 5,
    width: '90%',
    color: '#fff',
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginHorizontal: 'auto',
    gap: 12,
  },
})
