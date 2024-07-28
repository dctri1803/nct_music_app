import Artist from './Artist'

export default interface Song {
  id: number
  name: string
  imagePath: string
  url: string
  releasedOn: string
  genre: string
  numberLikes: number
  artists: Artist[]
}
