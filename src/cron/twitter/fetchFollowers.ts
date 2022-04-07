import axios from 'axios'

const fetchFollowers = async (link: string): Promise<number> => {
  const response = await axios.get(link)
  console.log(response.data)
  return 0
}

fetchFollowers('https://www.twitter.com/larvalabs').then((data) =>
  console.log(data)
)

export default fetchFollowers
