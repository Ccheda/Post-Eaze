const db = require('../models');
const Users = db.users;

const Posts = db.posts;

const Subscriptions = db.subscriptions;

const Topics = db.topics;

const PostsData = [
  {
    content: 'Excited to share my latest project on LinkedIn!',

    // type code here for "relation_one" field
  },

  {
    content: 'Looking for feedback on my recent post.',

    // type code here for "relation_one" field
  },

  {
    content: 'Here are some tips for effective networking.',

    // type code here for "relation_one" field
  },

  {
    content: 'Just completed my trial period and loving this tool!',

    // type code here for "relation_one" field
  },
];

const SubscriptionsData = [
  {
    plan: 'Trial',

    start_date: new Date('2023-10-01T00:00:00Z'),

    end_date: new Date('2023-10-04T00:00:00Z'),

    // type code here for "relation_one" field
  },

  {
    plan: 'Monthly',

    start_date: new Date('2023-10-01T00:00:00Z'),

    end_date: new Date('2023-11-01T00:00:00Z'),

    // type code here for "relation_one" field
  },

  {
    plan: 'Yearly',

    start_date: new Date('2023-10-01T00:00:00Z'),

    end_date: new Date('2024-10-01T00:00:00Z'),

    // type code here for "relation_one" field
  },

  {
    plan: 'Monthly',

    start_date: new Date('2023-10-01T00:00:00Z'),

    end_date: new Date('2023-11-01T00:00:00Z'),

    // type code here for "relation_one" field
  },
];

const TopicsData = [
  {
    title: 'Career Development',

    // type code here for "relation_many" field

    // type code here for "relation_one" field
  },

  {
    title: 'Networking Tips',

    // type code here for "relation_many" field

    // type code here for "relation_one" field
  },

  {
    title: 'Project Updates',

    // type code here for "relation_many" field

    // type code here for "relation_one" field
  },

  {
    title: 'Feedback Requests',

    // type code here for "relation_many" field

    // type code here for "relation_one" field
  },
];

async function associatePostWithUser() {
  const relatedUser0 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Post0 = await Posts.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Post0?.setUser) {
    await Post0.setUser(relatedUser0);
  }

  const relatedUser1 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Post1 = await Posts.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Post1?.setUser) {
    await Post1.setUser(relatedUser1);
  }

  const relatedUser2 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Post2 = await Posts.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Post2?.setUser) {
    await Post2.setUser(relatedUser2);
  }

  const relatedUser3 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Post3 = await Posts.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Post3?.setUser) {
    await Post3.setUser(relatedUser3);
  }
}

async function associateSubscriptionWithUser() {
  const relatedUser0 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Subscription0 = await Subscriptions.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Subscription0?.setUser) {
    await Subscription0.setUser(relatedUser0);
  }

  const relatedUser1 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Subscription1 = await Subscriptions.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Subscription1?.setUser) {
    await Subscription1.setUser(relatedUser1);
  }

  const relatedUser2 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Subscription2 = await Subscriptions.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Subscription2?.setUser) {
    await Subscription2.setUser(relatedUser2);
  }

  const relatedUser3 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Subscription3 = await Subscriptions.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Subscription3?.setUser) {
    await Subscription3.setUser(relatedUser3);
  }
}

// Similar logic for "relation_many"

async function associateTopicWithUser() {
  const relatedUser0 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Topic0 = await Topics.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Topic0?.setUser) {
    await Topic0.setUser(relatedUser0);
  }

  const relatedUser1 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Topic1 = await Topics.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Topic1?.setUser) {
    await Topic1.setUser(relatedUser1);
  }

  const relatedUser2 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Topic2 = await Topics.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Topic2?.setUser) {
    await Topic2.setUser(relatedUser2);
  }

  const relatedUser3 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Topic3 = await Topics.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Topic3?.setUser) {
    await Topic3.setUser(relatedUser3);
  }
}

async function associateUserWithUser() {
  const relatedUser0 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const User0 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (User0?.setUser) {
    await User0.setUser(relatedUser0);
  }

  const relatedUser1 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const User1 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (User1?.setUser) {
    await User1.setUser(relatedUser1);
  }

  const relatedUser2 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const User2 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (User2?.setUser) {
    await User2.setUser(relatedUser2);
  }

  const relatedUser3 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const User3 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (User3?.setUser) {
    await User3.setUser(relatedUser3);
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Posts.bulkCreate(PostsData);

    await Subscriptions.bulkCreate(SubscriptionsData);

    await Topics.bulkCreate(TopicsData);

    await Promise.all([
      await associatePostWithUser(),

      await associateSubscriptionWithUser(),

      // Similar logic for "relation_many"

      await associateTopicWithUser(),

      await associateUserWithUser(),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('posts', null, {});

    await queryInterface.bulkDelete('subscriptions', null, {});

    await queryInterface.bulkDelete('topics', null, {});
  },
};
