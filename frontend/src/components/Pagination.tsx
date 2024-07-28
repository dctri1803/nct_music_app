import React from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import { Colors } from '../constant/Colors'
import { useAppDispatch } from '../features/store'

const Pagination = ({
  pageNum,
  pageSize,
  totalPages,
  totalItems,
  onPageChange,
}) => {
  const dispatch = useAppDispatch()

  const renderPageNumbers = () => {
    const pageNumbers = []
    let startPage: number, endPage: number

    if (totalPages <= 3) {
      startPage = 1
      endPage = totalPages
    } else {
      if (pageNum <= 2) {
        startPage = 1
        endPage = 3
      } else if (pageNum >= totalPages - 1) {
        startPage = totalPages - 2
        endPage = totalPages
      } else {
        startPage = pageNum - 1
        endPage = pageNum + 1
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Pressable
          key={i}
          style={[
            styles.pageButton,
            pageNum === i ? styles.activePageButton : null,
          ]}
          onPress={() => handlePageChange(i)}
        >
          <Text style={styles.pageButtonText}>{i}</Text>
        </Pressable>
      )
    }

    return pageNumbers
  }

  const handlePageChange = (page) => {
    // Kiểm tra nếu đang ở trang đầu tiên thì không cho nhấn nút "First"
    if (page === 1 && pageNum === 1) {
      return
    }

    // Kiểm tra nếu đang ở trang cuối cùng thì không cho nhấn nút "Last"
    if (page === totalPages && pageNum === totalPages) {
      return
    }

    // Gọi hàm onPageChange từ component cha với trang mới
    onPageChange(page)
  }

  return (
    <View style={styles.container}>
      <Pressable
        style={[
          styles.pageButton,
          styles.firstLastButton,
          pageNum === 1 ? styles.disabledButton : null,
        ]}
        onPress={() => handlePageChange(1)}
        disabled={pageNum === 1}
      >
        <Text style={styles.pageButtonText}>First</Text>
      </Pressable>

      {renderPageNumbers()}

      <Pressable
        style={[
          styles.pageButton,
          styles.firstLastButton,
          pageNum === totalPages ? styles.disabledButton : null,
        ]}
        onPress={() => handlePageChange(totalPages)}
        disabled={pageNum === totalPages}
      >
        <Text style={styles.pageButtonText}>Last</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  pageButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.primary800,
    borderRadius: 4,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: Colors.primary500,
  },
  activePageButton: {
    backgroundColor: Colors.primary500,
  },
  pageButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  firstLastButton: {
    borderWidth: 1,
    borderColor: Colors.primary500,
  },
  disabledButton: {
    opacity: 0.5,
    borderWidth: 1,
    borderColor: Colors.gray500,
  },
})

export default Pagination
