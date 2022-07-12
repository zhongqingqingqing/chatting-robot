const loginIdValidator = new FieldValidator("txtLoginId", async function (val) {
  if (!val) {
    return "账号不能为空";
  }
});

const LoginPwdValidator = new FieldValidator("txtLoginPwd", async function (
  val
) {
  if (!val) {
    return "密码不能为空";
  }
});

//给表单注册提交事件
const form = $(".user-form");
form.addEventListener("submit", async (e) => {
  e.preventDefault(); //阻止表单默认行为（提交后立马刷新的行为）

  //全部在验证一遍
  const result = await FieldValidator.validate(
    loginIdValidator,
    LoginPwdValidator
  );

  if (!result) {
    return; //如果验证没通过，则不做处理
  }

  //验证通过
  //获得表单的数据
  const formData = new FormData(form); //得到表单数据对象（根据name为键，记录的键值对）
  const data = Object.fromEntries(formData.entries()); //得到数据对象

  //登录
  const fruit = await API.login(data);
  if (fruit.code === 0) {
    alert("登录成功，点击确定，跳到首页");
    location.href = "./index.html";
  } else {
    loginIdValidator.p.innerText = "账号或密码错误";
  }
});
