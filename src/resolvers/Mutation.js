import bcrypt from 'bcryptjs';
import UserModel from '../models/UserModel';
import ProductModel from '../models/ProductModel';
import Cart from '../models/CartModel';
//Mutation user CUD to database
const Mutation =  {
    signup: async (parent, args, context, info) => {
      //Check if not email
      const email = args.email.trim().toLowerCase()
      const currentUser = await UserModel.find({})
      const isEmailExist = currentUser.findIndex(user =>user.email === email) > -1
      if(isEmailExist) {
        throw new Error('Email already exist...!')
      }
      //Check Validate password
      if(args.password.trim().length < 6){
        throw new Error('Password must be least at 6 characters')
      } 
      const password = await bcrypt.hash(args.password, 10)
      const newUser = await UserModel.create({...args, email, password});
  
      return newUser
    },

    //Create user's Product
    createProduct: async (parent, args, {userId}, info) => {
      //Check User logged in
      if(!userId) throw new Error('Plz Login to processed...!')
      if(!args.name || !args.description || !args.price || !args.imageUrl){
        throw new Error('Plz, provide all required field...!')
      }
      const product = await ProductModel.create({...args, user: userId})
      const user = await UserModel.findById(userId)
      if(!user.products){
        user.products = [product]
      }else {
        user.products.push(product)
      }
      console.log(user)
      await user.save();
      return ProductModel.findById(product.id).populate({
        path: 'user', 
        populate: {path: 'products'}
      })
    },
    //Update Prodroct mutation
    updateProduct: async (parent, args, {userId}, info) => {
      const {id, name, description, price, imageUrl} = args

      //TODO: Check if user login
      if(!userId) throw new Error('Plz, login to process')
      //GET QUERY Product from database
      const product = await ProductModel.findById(id)


      //TODO: Check User loged in is the onwer Product
      if(userId !== product.user.toString()){
        throw new Error('You are not authorized...!')
      }

      const updateInfo = {
          name: !!name ? name : product.name,
          description: !!description ? description : product.description,
          price: !!price ? price : product.price,
          imageUrl: !!imageUrl ? imageUrl : product.imageUrl
      }

      //Update Product information in database
      await ProductModel.findByIdAndUpdate(id, updateInfo)

      //Find the updated Product and return
      const updatedProduct = await ProductModel.findById(id).populate({path: 'user'})

      return updatedProduct
    },
    //****************************Cart Items*********************************** */
    //Add To Cart Mutation
    addToCart: async (parent, args, { userId }, info) => {
      //id ---> ProductId
      const {id} = args
       //Find User Who preformed added To cart-- Full logical is userId from login
       if(!userId) throw new Error('Plz, Login to process')

       console.log('user-->', userId)
        try {
          
          //Check if the new addToCart items is already user.carts
          const user = await UserModel.findById(userId).populate({
            path: 'carts', 
            populate: {path: 'product'}
          });

          const findCartItemIndex = user.carts.findIndex(cartItem => cartItem.product.id === id);

          if(findCartItemIndex > -1){
            //A. the new addToCart item is already Exist is Carts
            //A.1 Find the itemCart from databade /Update
            const CartList = user.carts[findCartItemIndex].qualtity += 1;
            await Cart.findByIdAndUpdate(user.carts[findCartItemIndex].id, {
              qualtity: CartList
            }) //Get From Cart Item ID from index


            //A.2 Find Updated cartItem
            const updateCartItem = await Cart.findById(user.carts[findCartItemIndex].id)
                .populate({path: 'product'})
                .populate({path: 'user'})

            return updateCartItem;
          } else {
            //B. the new addToCart is not in Cart yet
            const cartItem = await Cart.create({
              product: id,
              qualtity: 1,
              user: userId
            })
            //B.1 Create new cart
            const newCartItem = await Cart.findById(cartItem.id)
              .populate({path: 'product'})
              .populate({path: 'user'})
            //B.2 Update user.cart
            await UserModel.findByIdAndUpdate(userId, {carts: [...user.carts, newCartItem]})
            return newCartItem;
          }        
        } catch (error) {
          console.log(error)
      }
    },

    //Delete Cart
    deleteCart: async (parent, args, {userId}, info) => { 
      const {id} = args
      //Check ID to match Cart.id
      const cart = await Cart.findById(id)
      //Check if user logged in
      if(!userId) throw new Error('Plz, Login to Process...!')
      const user = await UserModel.findById(userId)

      //Check Ownership CartItem
      if(cart.user.toString() !== userId ){
        throw new Error('you are not authorized...!')
      }


      //Delete Cart item
      const deletedCart = await Cart.findOneAndRemove(id)

      const updatedUserCart = user.carts.filter(cartId => cartId.toString() !== deletedCart.id.toString())

      await UserModel.findByIdAndUpdate(userId, {carts: updatedUserCart})

      return deletedCart
    }
}
export default Mutation;