const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  const topics = [
    {
      name: 'JavaScript',
      imgUrl: '/images/icons/js.svg',
    },
    {
      name: 'Python',
      imgUrl: '/images/icons/python.svg',
    },
    {
      name: 'PHP',
      imgUrl: '/images/icons/php.svg',
    },
    {
      name: 'Java',
      imgUrl: '/images/icons/java.svg',
    },
    {
      name: 'C#',
      imgUrl: '/images/icons/c_sharp.svg',
    },
    {
      name: 'TypeScript',
      imgUrl: '/images/icons/typescript.png',
    },
    {
      name: 'C++',
      imgUrl: '/images/icons/c++.png',
    },
    {
      name: 'Dart',
      imgUrl: '/images/icons/dart.png',
    },
  ];

  console.log('userrrrrrrr', req.user);
  console.log('isAuthenticated', req.isAuthenticated());

  const { isAuthenticated, user } = req;
  const context = {
    title: 'Devs Hub',
    topics,
    isAuthenticated,
    user,
  };

  res.render('index', context);
});

module.exports = router;
