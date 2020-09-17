import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel';
import ProductModel from '../models/ProductModel';
//Query user from the database
const Query =  {
  login: async (parent, args, context, info) => {
    const { email, password } = args
    //Find User in database
    const user = await UserModel.findOne({ email })

    if(!user) throw new Error('Email not found, Plz sign up...!')

    //Check Password
    const validPassword = await bcrypt.compare(password, user.password)

    if(!validPassword) throw new Error('Invalid email or password...!')

    //Create Generate key token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET, {expiresIn: '1d'})

    return {userId: user.id, jwt: token}
  },
  user: (parent, args, {userId}, info) =>  {
    //Check User loged in
    if(!userId) throw new Error('Plz login...!')
    if(userId !== args.id) throw new Error('You are not authorized...!')
    return UserModel.findById(args.id)
      .populate({
        path: 'products', 
        populate: {path: 'user'}
      }).populate({
        path: 'carts', 
        populate: {path: 'product'}
      })
  }
   ,
  users: (parent, args, context, info) => 
    UserModel.find({}).populate({
    path: 'products', 
    populate: {path: 'user'}
  }).populate({
    path: 'carts', 
    populate: {path: 'product'}
  }),
  product: (parent, args, context, info) => 
    ProductModel.findById(args.id).populate({
    path: 'user', 
    populate: {path: 'products'}
  }),
  products:(parent, args, context, info) => 
    ProductModel.find().populate({
    path: 'user', 
    populate: {path: 'products'}
  }),
}
export default Query;