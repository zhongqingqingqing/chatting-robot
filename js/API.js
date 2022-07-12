var API = (function () {
  // 基地址
  const BASE_URL = "https://study.duyiedu.com";
  //本地存储的键
  const TOKEN_KEY = "token";

  /**
   * 实现get方法的函数
   * @param {*} path 传入一个路径
   */
  function get(path) {
    const headers = {};

    //从本地取得token，判断是否有值
    const token = localStorage.getItem(TOKEN_KEY);

    if (token) {
      //如果本地token有值，则加入headers中，没有则不做处理
      headers.authorization = `Bearer ${token}`;
    }

    // 发送get请求，返回一个Promise对象
    return fetch(BASE_URL + path, { headers });
  }

  /**
   * 实现post方法得函数
   * @param {*} path     传入路径
   * @param {*} bodyObj  传入请求体
   * @returns
   */
  function post(path, bodyObj) {
    const headers = {
      "Content-Type": "application/json",
    };

    //从本地取得token，判断是否有值
    const token = localStorage.getItem(TOKEN_KEY);

    if (token) {
      //如果本地token有值，则加入headers中，没有则不做处理
      headers.authorization = `Bearer ${token}`;
    }

    return fetch(BASE_URL + path, {
      method: "POST",
      headers,
      body: JSON.stringify(bodyObj),
    });
  }

  // 注册
  async function reg(userInfo) {
    const resp = await post("/api/user/reg", userInfo);
    return await resp.json();
  }

  // 登录
  async function login(loginInfo) {
    const resp = await post("/api/user/login", loginInfo);

    const result = await resp.json();

    if (result.code === 0) {
      //登录成功
      //把生成的token令牌保存到本地存储
      const token = resp.headers.get("authorization");
      localStorage.setItem("token", token);
    }

    return result;
  }

  // 验证账号
  async function exists(loginId) {
    const resp = await get("/api/user/exists?loginId=" + loginId);
    return await resp.json();
  }

  // 当前登录的用户信息
  async function profile() {
    const resp = await get("/api/user/profile");
    return await resp.json();
  }

  // 发送聊天信息
  async function sendChat(content) {
    const resp = await post("/api/chat", {
      content,
    });
    return await resp.json();
  }

  // 获取聊天记录
  async function getHistory() {
    const resp = await get("/api/chat/history");
    return await resp.json();
  }

  //退出登录
  function loginOut() {
    localStorage.removeItem(TOKEN_KEY);
  }

  return {
    reg,
    login,
    exists,
    profile,
    sendChat,
    getHistory,
    loginOut,
  };
})();
