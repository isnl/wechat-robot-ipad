/*
 * @Author: Peanut
 * @Description:  加入群聊
 * @Date: 2020-05-21 14:11:35
 * @Last Modified by: Peanut
 * @Last Modified time: 2020-05-21 22:39:37
 */
async function onRoomJoin(room, inviteeList, inviter) {
  const nameList = inviteeList.map(c => c.name()).join(",");
  console.log(
    `Room ${room.topic()} got new member ${nameList}, invited by ${inviter}`
  );
}

module.exports = onRoomJoin;
