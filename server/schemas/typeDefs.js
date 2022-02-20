const { gql } = require('apollo-server-express');
const typeDefs = gql`
type User {
    _id: ID!
    username: String!
    email: String!
    password: String!
    bookCount:Int
    savedBooks: [Book]!
  }

  type Book {
    _id: ID!
    bookId: String!
    authors: [String]
    description: String
    title: String
    image:String
    link:String
  }

  type Auth {
    token: ID!
    user: User
  }
  type Query {
      me:User
  }

  input SavedBookInput{
   
    bookId: String!
    authors: [String]
    description: String
    title: String
    image:String
    link:String
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    loginUser(email: String!, password: String!): Auth
    savedBook (book:SavedBookInput):User
   
    removeBook(bookId: String!): User
  }
`;
module.exports = typeDefs;