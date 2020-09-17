import jwt from 'jsonwebtoken'

const getUser = (token) => {
  if(!token) return null

  //spitc toeken
  const parseToken = token.split(' ')[1]
  try {
    const decodedToken = jwt.verify(parseToken, process.env.APP_SECRET)
    return decodedToken.userId
  } catch (error) {
    return null
  }
}

export default getUser;