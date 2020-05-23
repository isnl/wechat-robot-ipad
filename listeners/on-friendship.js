/**
 * 处理好友关系模块
 * by: Peanut
 */
const {
  Friendship
} = require("wechaty");
/**
 * 自动同意好友请求
 */
async function onFriendship(friendship) {
  if (friendship.type() === Friendship.Type.Receive) {
    await friendship.accept();
  }
}
module.exports = onFriendship
