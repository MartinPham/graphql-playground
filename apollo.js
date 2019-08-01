const { ApolloServer, gql } = require('apollo-server');

const users = [
  {
    id: '1',
    name: 'u1'
  },
  {
    id: '2',
    name: 'u2'
  },
];

const tasks = [
  {
    id: '1',
    name: 't1',
    isCompleted: true,
    userId: '1'
  },
  {
    id: '2',
    name: 't2',
    isCompleted: false,
    userId: '2'
  },
];

const typeDefs = gql`
  type Task {
    id: String
    name: String
    isCompleted: Boolean
  }

  type User {
    id: String
    name: String
    tasks(isCompleted: Boolean): [Task]
  }

  type Query {
    users: [User]
    tasks(isCompleted: Boolean): [Task]
    completedTasks: [Task]
  }
`;

const resolvers = {
  Query: {
    users: () => users,
    tasks: (root, {isCompleted = null}, context, info) => tasks.filter(task => isCompleted === null || task.isCompleted === isCompleted),
    completedTasks: () => tasks.filter(task => task.isCompleted),
  },
  User: {
    tasks: (root, {isCompleted = null}) => tasks.filter(task => task.userId === root.id && (isCompleted === null || task.isCompleted === isCompleted)),
  }
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({ typeDefs, resolvers });

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});