import {GraphQLDateTime} from 'graphql-iso-date'
import Mutation from './Mutation';
import Query from './Query';

const resolvers = {
  Query,
  Mutation,
  Date: GraphQLDateTime
}

export default resolvers