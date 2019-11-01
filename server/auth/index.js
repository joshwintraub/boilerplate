const router = require('express').Router();
const User = require('../db/models/User');

module.exports = router;

router.post('/signup', async (req, res, next) => {
  await User.create(req.body)
    .then(user => {
      req.login(user, err => {
        if (err) next(err);
        else res.json(user);
      });
    })
    .catch(next);
});

router.put('/login', async (req, res, next) => {
  await User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      if (!user) res.status(401).send('User not found');
      else if (!user.hasMatchingPassword(req.body.password)) {
        res.status(401).send('Incorrect password');
      } else {
        req.login(user, err => {
          if (err) next(err);
          else res.json(user);
        });
      }
    })
    .catch(next);
});

router.delete('/logout', (req, res, next) => {
  req.logout();
  req.session.destroy()
  res.sendStatus(204);
});

router.get('/me', (req, res, next) => {
  res.json(req.user);
});

// check currently-authenticated user, i.e. "who am I?"
// router.get('/me', (req, res, next) => {
//   res.send(req.user)
// });

// // signup, i.e. "let `me` introduce myself"
// router.post('/signup', async (req, res, next) => {
//   const [user, created] = await User.findOrCreate({
//     where: {
//       email: req.body.email
//     },
//     defaults: { // if the user doesn't exist, create including this info
//       password: req.body.password
//     }
//   });

//   if (created) {
//     req.logIn(user, (err) => {
//       if (err) return next(err)
//       res.json(user)
//     })
//   } else {
//     res.sendStatus(401) // this user already exists, you cannot sign up
//   }
// });

// // login, i.e. "you remember `me`, right?"
// router.put('/login', async (req, res, next) => {
//   try {
//     const user = await User.findOne({
//       where: req.body // email and password
//     })

//     if (!user) {
//       res.sendStatus(401) // no message good practice to omit why auth fails
//     } else {
//       req.logIn(user, (err) => {
//         if (err) return next(err)
//         res.json(user)
//       })
//     }
//   } catch (err) {
//     next(err)
//   }
// });

// // logout, i.e. "please just forget `me`"
// router.delete('/logout', (req, res, next) => {
//   req.logOut()
//   res.sendStatus(204)
// });
