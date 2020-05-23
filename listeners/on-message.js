/*
 * @Author: Peanut
 * @Description:  处理用户消息
 * @Date: 2020-05-20 22:36:28
 * @Last Modified by: Peanut
 * @Last Modified time: 2020-05-23 23:20:36
 */
const bot = require("../app.js");
const { UrlLink } = require("wechaty");
const path = require("path");
const { FileBox } = require("file-box");
const superagent = require("../superagent");
const config = require("../config");
const { colorRGBtoHex, colorHex } = require("../utils");

const allKeywords = `回复序号或关键字获取对应服务
1.${config.WEBROOM}
2.毒鸡汤
3.神回复(略微开车)
4.英语一句话
转小写(例：转小写PEANUT)
转大写(例：转大写peanut)
转rgb(例：转rgb#cccccc)
转16进制(例：转16进制rgb(255,255,255))
天气 城市名(例：天气 西安)
全国肺炎(实时肺炎数据)
省份/自治区 肺炎(例：河南肺炎)`;
/**
 * sleep
 * @param {*} ms
 */
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
/**
 * 处理消息
 */
async function onMessage(msg) {
  //防止自己和自己对话
  if (msg.self()) return;
  const room = msg.room(); // 是否是群消息
  if (room) {
    //处理群消息
    await onWebRoomMessage(msg);
  } else {
    //处理用户消息  用户消息暂时只处理文本消息。后续考虑其他
    const isText = msg.type() === bot.Message.Type.Text;
    if (isText) {
      await onPeopleMessage(msg);
    }
  }
}
/**
 * 处理用户消息
 */
async function onPeopleMessage(msg) {
  //获取发消息人
  const contact = msg.from();
  //对config配置文件中 ignore的用户消息不必处理
  if (config.IGNORE.includes(contact.payload.name)) return;
  let content = msg.text().trim(); // 消息内容 使用trim()去除前后空格

  if (content === "菜单") {
    await delay(200);
    await msg.say(allKeywords);
  } else if (content === "打赏") {
    //这里换成自己的赞赏二维码
    const fileBox = FileBox.fromFile(path.join(__dirname, "../imgs/pay.png"));
    await msg.say("我是秦始皇，打钱!!!!!");
    await delay(200);
    await msg.say(fileBox);
  } else if (content === config.WEBROOM || parseInt(content) === 1) {
    const webRoom = await bot.Room.find({
      topic: config.WEBROOM
    });
    if (webRoom) {
      try {
        await delay(200);
        await webRoom.add(contact);
      } catch (e) {
        console.error(e);
      }
    }
  } else if (content === "毒鸡汤" || parseInt(content) === 2) {
    let soup = await superagent.getSoup();
    await delay(200);
    await msg.say(soup);
  } else if (content === "神回复" || parseInt(content) === 3) {
    const { title, content } = await superagent.getGodReply();
    await delay(200);
    await msg.say(`标题：${title}<br><br>神回复：${content}`);
  } else if (content === "英语一句话" || parseInt(content) === 4) {
    const { en, zh } = await superagent.getEnglishOne();
    await delay(200);
    await msg.say(`en：${en}<br><br>zh：${zh}`);
  } else if (content === "艾特网" || content === "导航站") {
    //发送链接卡片  web版协议不可用。
    const urlLink = new UrlLink({
      description: "来了来了，专为程序员量身定做的导航站来了！",
      thumbnailUrl: "https://www.iiter.cn/_nuxt/img/f996b71.png",
      title: "艾特网 - 程序员专用导航站",
      url: "https://iiter.cn"
    });
    await msg.say(urlLink);
  } else if (content === "客服") {
    const contactCard = await bot.Contact.find({ alias: config.MYSELF }); // change 'lijiarui' to any of the room member
    await msg.say(contactCard);
  } else {
    const noUtils = await onUtilsMessage(msg);
    if (noUtils) {
      await delay(200);
      await msg.say(allKeywords);
    }
  }
}
/**
 * 处理群消息
 */
async function onWebRoomMessage(msg) {
  const isText = msg.type() === bot.Message.Type.Text;
  if (isText) {
    const content = msg.text().trim(); // 消息内容
    if (content === "毒鸡汤") {
      let poison = await superagent.getSoup();
      await delay(200);
      await msg.say(poison);
    } else if (content === "英语一句话") {
      const res = await superagent.getEnglishOne();
      await delay(200);
      await msg.say(`en：${res.en}<br><br>zh：${res.zh}`);
    } else if (content.includes("踢@")) {
      // 踢人功能  群里发送  踢@某某某  即可
      const room = msg.room();
      //获取发消息人
      const contact = msg.from();
      const alias = await contact.alias();
      //如果是机器人好友且备注是自己的大号备注  才执行踢人操作
      if (contact.friend() && alias === config.MYSELF) {
        const delName = content.replace("踢@", "").trim();
        const delContact = await room.member({ name: delName });
        await room.del(delContact);
        await msg.say(delName + "已被移除群聊。且聊且珍惜啊！");
      }
      // @用户
      // const room = msg.room();
      // const members = await room.memberAll(); //获取所有群成员
      // const someMembers = members.slice(0, 3);
      // await room.say("Hello world!", ...someMembers); //@这仨人  并说 hello world
    } else {
      await onUtilsMessage(msg);
    }
  }
}

/**
 * utils消息处理
 */
async function onUtilsMessage(msg) {
  const contact = msg.from(); // 发消息人
  const isText = msg.type() === bot.Message.Type.Text;
  if (isText) {
    let content = msg.text().trim(); // 消息内容
    if (content.indexOf("转大写") === 0) {
      try {
        const str = content.replace("转大写", "").trim().toUpperCase();
        await msg.say(str);
      } catch (error) {
        await msg.say("转换失败，请检查");
      }
    } else if (content.indexOf("转小写") === 0) {
      try {
        const str = content.replace("转小写", "").trim().toLowerCase();
        await msg.say(str);
      } catch (error) {
        await msg.say("转换失败，请检查");
      }
    } else if (content.indexOf("转16进制") === 0) {
      try {
        const color = colorRGBtoHex(content.replace("转16进制", "").trim());
        await msg.say(color);
      } catch (error) {
        console.error(error);
        await msg.say("转换失败，请检查");
      }
    } else if (content.indexOf("转rgb") === 0) {
      try {
        const color = colorHex(content.replace("转rgb", "").trim());
        await msg.say(color);
      } catch (error) {
        console.error(error);
        await msg.say("转换失败，请检查");
      }
    } else if (content === "全国肺炎") {
      try {
        const res = await superagent.getChinaFeiyan();
        const chinaTotal = res.data.chinaTotal.total;
        const chinaToday = res.data.chinaTotal.today;
        const str = `全国新冠肺炎实时数据：<br>确诊：${
          chinaTotal.confirm
        }<br>较昨日：${
          chinaToday.confirm > 0 ? "+" + chinaToday.confirm : chinaToday.confirm
        }<br>疑似：${chinaTotal.suspect}<br>较昨日：${
          chinaToday.suspect > 0 ? "+" + chinaToday.suspect : chinaToday.suspect
        }<br>死亡：${chinaTotal.dead}<br>较昨日：${
          chinaToday.dead > 0 ? "+" + chinaToday.dead : chinaToday.dead
        }<br>治愈：${chinaTotal.heal}<br>较昨日：${
          chinaToday.heal > 0 ? "+" + chinaToday.heal : chinaToday.heal
        }<br>------------------<br>数据采集于网易，如有问题，请及时联系`;
        msg.say(str);
      } catch (error) {
        msg.say("接口错误");
      }
    } else if (content.includes("肺炎")) {
      const config = [
        "北京",
        "湖北",
        "广东",
        "浙江",
        "河南",
        "湖南",
        "重庆",
        "安徽",
        "四川",
        "山东",
        "吉林",
        "福建",
        "江西",
        "江苏",
        "上海",
        "广西",
        "海南",
        "陕西",
        "河北",
        "黑龙江",
        "辽宁",
        "云南",
        "天津",
        "山西",
        "甘肃",
        "内蒙古",
        "台湾",
        "澳门",
        "香港",
        "贵州",
        "西藏",
        "青海",
        "新疆",
        "宁夏"
      ];
      let newContent = content.replace("肺炎", "").trim();
      if (config.includes(newContent)) {
        const data = await superagent.getProvinceFeiyan(newContent);
        let citystr = "名称  确诊  治愈  死亡<br>";
        data.city.forEach(item => {
          citystr =
            citystr +
            `${item.name}  ${item.conNum}  ${item.cureNum}  ${item.deathNum}<br>`;
        });
        const str = `${newContent}新冠肺炎实时数据：<br>确诊：${data.value}<br>较昨日：${data.adddaily.conadd}<br>死亡：${data.deathNum}<br>较昨日：${data.adddaily.deathadd}<br>治愈：${data.cureNum}<br>较昨日：${data.adddaily.cureadd}<br>------------------<br>各地市实时数据：<br>${citystr}------------------<br>数据采集于新浪，如有问题，请及时联系`;
        msg.say(str);
      }
    } else {
      return true;
    }
  } else {
    return true;
  }
}
module.exports = onMessage;
