export default interface PageableResponse<T> {
  items: T[]
  pageNum: number
  pageSize: number
  totalItems: number
  totalPages: number
}
