import {gql} from 'apollo-server-express';

const typeDefs = gql`
type Query {
  me: User!
  user(id: ID!): User
  users: [User]!
  # product:(id: ID!): Product
  # products: [Product]!
}  

type User {
      id: ID!
      username: String!
      email: String!
      # password: String!
      # products: [Product]
  }


  # type Product {
  #      id: ID!
  #      name: String!
  #      description: String!
  #      price: Float!
  #      imageUrl: String!
  #      user: User!
  #  }
`
 

export default typeDefs