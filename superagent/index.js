const superagent = require("../config/superagent");
const cheerio = require("cheerio");
const request = require("request");
const ONE = "http://wufazhuce.com/"; // ONE的web版网站
const POISON = "https://8zt.cc/"; //毒鸡汤网站
const TXHOST = "https://api.tianapi.com/txapi/"; // 天行host 官网：tianapi.com
const APIKEY = ""; // 天行key，请先去网站注册填写key  注册免费  注册后申请下面的接口即可。
/**
 * 获取每日一句
 */
async function getOne() {
  try {
    let res = await superagent.req(ONE, "GET");
    let $ = cheerio.load(res.text);
    let todayOneList = $("#carousel-one .carousel-inner .item");
    let todayOne = $(todayOneList[0])
      .find(".fp-one-cita")
      .text()
      .replace(/(^\s*)|(\s*$)/g, "");
    return todayOne;
  } catch (err) {
    console.log("错误", err);
    return err;
  }
}

/**
 * 获取每日毒鸡汤
 */
async function getSoup() {
  try {
    let res = await superagent.req(POISON, "GET");
    let $ = cheerio.load(res.text);
    const content = $("#sentence").text();
    return content;
  } catch (err) {
    console.error("err");
    return err;
  }
}

/**
 * 获取全国肺炎数据
 */
function getChinaFeiyan() {
  return new Promise((resolve, reject) => {
    request.get(
      {
        url: `https://c.m.163.com/ug/api/wuhan/app/data/list-total?t=${new Date().getTime()}`
      },
      function (err, response) {
        if (err) {
          reject(err);
        }
        const res = JSON.parse(response.body);
        resolve(res);
      }
    );
  });
}
/**
 * 获取省份肺炎数据
 */
async function getProvinceFeiyan(name) {
  return new Promise((resolve, reject) => {
    request.get(
      {
        url: `https://gwpre.sina.cn/interface/fymap2020_data.json?t=${new Date().getTime()}`
      },
      function (err, response) {
        if (err) {
          reject(err);
        }
        try {
          const res = JSON.parse(response.body);
          res.data.list.forEach(item => {
            if (name === item.name) {
              resolve(item);
              return;
            }
          });
        } catch (error) {
          reject(err);
        }
      }
    );
  });
}
/**
 * 获取神回复
 */
async function getGodReply() {
  const url = TXHOST + "godreply/index";
  try {
    let res = await superagent.req(url, "GET", {
      key: APIKEY
    });
    let content = JSON.parse(res.text);
    if (content.code === 200) {
      return content.newslist[0];
    } else {
      console.log("获取接口失败", content.msg);
    }
  } catch (err) {
    console.log("获取接口失败", err);
  }
}
/**
 * 每日英语一句话
 */
async function getEnglishOne() {
  const url = TXHOST + "ensentence/index";
  try {
    let res = await superagent.req(url, "GET", {
      key: APIKEY
    });
    let content = JSON.parse(res.text);
    if (content.code === 200) {
      return content.newslist[0]; //en英文  zh中文
    } else {
      console.log("获取接口失败", content.msg);
    }
  } catch (err) {
    console.log("获取接口失败", err);
  }
}
module.exports = {
  getOne,
  getSoup,
  getChinaFeiyan,
  getProvinceFeiyan,
  getGodReply,
  getEnglishOne
};
