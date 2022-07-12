(async function () {
  //1、未登录时不显示信息
  //1.1获得当前登录的状态
  const status = await API.profile();

  //1.2未登录时,跳到登录页面
  if (status.code) {
    alert("登录失败或登录已过期");
    location.href = "./login.html";
  }

  //2、登录成功后
  //获得DOM元素
  const doms = {
    aside: {
      nickname: $("#nickname"),
      loginId: $("#loginId"),
    },
    close: $(".close"),
    chatContainer: $(".chat-container"),
    msgContainer: $(".msg-container"),
    txtMsg: $("#txtMsg"),
  };

  //2.1显示昵称和账号
  doms.aside.loginId.innerText = status.data.loginId;
  doms.aside.nickname.innerText = status.data.nickname;

  //2.2注册退出事件
  doms.close.addEventListener("click", async () => {
    await API.loginOut();
    location.href = "./login.html";
  });

  //2.3获取聊天记录，并显示在页面中
  getHistory();
  async function getHistory() {
    const resp = await API.getHistory();

    //2.3.1获取失败，不做处理
    if (resp.code) {
      return;
    }

    //获取成功
    //2.3.2循环创建聊天信息
    for (const item of resp.data) {
      setChat(item);
    }

    //让滑动条滑倒底部
    scrollBottom();
  }

  //2.4给发信息的表单注册提交事件
  doms.msgContainer.addEventListener("submit", async (e) => {
    //2.4.1阻止表单默认行为
    e.preventDefault();
    addChat();
  });

  /**
   * 根据传入的对象 ，创建聊天信息元素
   * @param{object} chatInfo
   */
  function setChat(chatInfo) {
    const div = $$$("div");
    div.classList.add("chat-item");
    if (chatInfo.from) {
      div.classList.add("me");
    }

    const img = $$$("img");
    img.className = "chat-avatar";
    img.src = chatInfo.from ? "./asset/avatar.png" : "./asset/robot-avatar.jpg";

    const content = $$$("div");
    content.className = "chat-content";
    content.innerText = chatInfo.content;

    const time = $$$("div");
    time.className = "chat-date";
    time.innerText = formatDate(chatInfo.createdAt);

    div.appendChild(img);
    div.appendChild(content);
    div.appendChild(time);

    doms.chatContainer.appendChild(div);
  }

  /**
   * 时间格式化
   * @param {*} createdAt 时间戳
   */
  function formatDate(createdAt) {
    const data = new Date(createdAt);
    const year = data.getFullYear();
    const month = (data.getMonth() + 1).toString().padStart(2, "0");
    const day = data.getDate().toString().padStart(2, "0");
    const hour = data.getHours().toString().padStart(2, "0");
    const minute = data.getMinutes().toString().padStart(2, "0");
    const second = data.getSeconds().toString().padStart(2, "0");
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }

  /**
   * 让滚动条滚动到底部
   */
  function scrollBottom() {
    //获得聊天区域的高度
    doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight;
    //设置
  }

  /**
   * 添加一条聊天信息（根据文本框的内容）
   */
  async function addChat() {
    //2.4.2获得input的内容
    const txt = doms.txtMsg.value.trim();
    if (!txt) {
      return; //没有内容，不做处理
    }

    //2.4.3有值时
    /**
 * content: "讲个笑话吧！"
    createdAt: 1656802292243
    from: "qingqing"
    to: null
 */
    setChat({
      from: status.data.loginId,
      to: null,
      content: txt,
      createdAt: new Date(),
    });
    //让滑动条滑倒底部
    scrollBottom();

    //清空文本框
    doms.txtMsg.value = "";

    //给服务器发送信息
    const resp = await API.sendChat(txt);

    setChat({
      ...resp.data,
    });
    //让滑动条滑倒底部
    scrollBottom();
  }
})();
