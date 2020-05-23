/*
 * @Author: Peanut
 * @Description:  离开群聊 - 机器人主动踢出才会触发此事件
 * @Date: 2020-05-21 22:36:41
 * @Last Modified by: Peanut
 * @Last Modified time: 2020-05-23 23:21:20
 */
async function onRoomLeave(room, leaverList) {
  const nameList = leaverList.map(c => c.name()).join(",");
  console.log(`Room ${room.topic()} lost member ${nameList}`);
}

module.exports = onRoomLeave;
