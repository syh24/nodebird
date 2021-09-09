const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

module.exports = () => {
    //로그인 시 실행
    passport.serializeUser((user, done) => {
        //done 함수의 첫 번째 인수는 에러 발생시 사용
        done(null, user.id);
    });

    //매 요청 시 실행
    passport.deserializeUser((id, done) => {
        User.findOne(
            { where: { id },
                include: [{
                    model: User,
                    attributes: ['id', 'nick'],
                    as: 'Followers',
                }, {
                    model: User,
                    attributes: ['id', 'nick'],
                    as: 'Followings',
                }],
        })
            .then(user => done(null, user)) //req.user에 저장
            .catch(err => done(err));
    });

    local();
    kakao();
}