import generateToken from './generateToken'

const generateId = async (): Promise<string> => await generateToken(12)

export default generateId
