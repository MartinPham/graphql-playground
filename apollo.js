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
    isImportant: false,
    userId: '1'
  },
  {
    id: '2',
    name: 't2',
    isCompleted: false,
    isImportant: true,
    userId: '2'
  },
];

const typeDefs = gql`
  input TaskFilter {
    isCompleted: Boolean
    isImportant: Boolean
  }

  type Task {
    id: String
    name: String
    isCompleted: Boolean
    isImportant: Boolean
  }

  type User {
    id: String
    name: String
    tasks(isCompleted: Boolean): [Task]
  }

  type Query {
    users: [User]
    tasks(filter: TaskFilter): [Task]
  }
`;

const resolvers = {
  Query: {
    users: () => users,
    tasks: (root, {filter = {}}, context, info) => tasks.filter(task => {
      let valid = true;
      if(typeof filter.isCompleted !== 'undefined' && filter.isCompleted !== task.isCompleted)
      {
        valid = false;
      }
      if(typeof filter.isImportant !== 'undefined' && filter.isImportant !== task.isImportant)
      {
        valid = false;
      }

      return valid;
    }),
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