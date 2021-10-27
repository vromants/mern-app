const  { Router } = require('express')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const router = Router();
const config = require('config')

router.post('/register',
    [
        check('email', 'Incorrect email').isEmail(),
        check('password', 'Invalid password').isLength({min: 6})
    ],
    async (req, res) => {
  try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
          return res.status(400).json({
              errors: errors.array(),
              message: 'Invalid user data'
          })
      }

      const { email, password} = req.body

      const candidate = await User.findOne({email})

      if (candidate) {
          return res.status(400).json({ message: "User with provided email has already existed"})
      }

      const hashedPassword = bcrypt.hashSync(password)
      const user = new User({email, password: hashedPassword})
      await user.save();

      res.status(201).json({message: 'New user is created '});

  }  catch (e) {
      res.status(500).json({message: "Something went wrong"})
  }
});

router.post('/login',
    [
        check('email', 'Incorrect email').normalizeEmail().isEmail(),
        check('password', 'Invalid password').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Invalid user data'
                })
            }

            const { email, password} = req.body
            const user = await User.findOne({email})

            if (!user) {
                return res.status(400).json({ message: 'User not found'})
            }

            const isMatch = await bcrypt.compare(password, user.password)

            if(!isMatch) {
                return res.status(400).json({message: 'Incorrect password'})
            }

            const token = jwt.sign(
                { userId: user.id },
                config.get('jwtSecret'),
                {expiresIn: '1h'}
            )

            res.json({ token, userId: user.id })

        }  catch (e) {
            res.status(500).json({message: "Something go wrong"})
        }
    })

module.exports = router