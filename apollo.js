const { ApolloServer, gql } = require('apollo-server');

const tasks = [
  {
    id: '1',
    name: 't1',
    isCompleted: true
  },
  {
    id: '2',
    name: 't2',
    isCompleted: false
  },
];

const typeDefs = gql`
  type Task {
    id: String
    name: String
  }

  type Query {
    tasks(isCompleted: Boolean): [Task]
    completedTasks: [Task]
  }
`;

const resolvers = {
  Query: {
    tasks: (root, args, context, info) => tasks.filter(task => task.isCompleted === args.isCompleted),
    completedTasks: () => tasks.filter(task => task.isCompleted),
  },
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