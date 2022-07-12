const loginIdValidator = new FieldValidator("txtLoginId", async function (val) {
  if (!val) {
    return "账号不能为空";
  }
  const result = await API.exists(val);
  if (result.data) {
    //result 为true说明账号已存在
    return "此账号已被占用，请填写新的账号";
  }
});

const nicknameValidator = new FieldValidator("txtNickname", async function (
  val
) {
  if (!val) {
    return "昵称不能为空";
  }
});

const LoginPwdValidator = new FieldValidator("txtLoginPwd", async function (
  val
) {
  if (!val) {
    return "密码不能为空";
  }
});

const LoginPwdConfirmValidator = new FieldValidator(
  "txtLoginPwdConfirm",
  async function (val) {
    if (!val) {
      return "请输入确认密码";
    }

    if (val !== LoginPwdValidator.input.value) {
      return "两次密码不一致";
    }
  }
);

//给表单注册提交事件
const form = $(".user-form");
form.addEventListener("submit", async (e) => {
  e.preventDefault(); //阻止表单默认行为（提交后立马刷新的行为）

  //全部在验证一遍
  const result = await FieldValidator.validate(
    loginIdValidator,
    nicknameValidator,
    LoginPwdValidator,
    LoginPwdConfirmValidator
  );

  if (!result) {
    return; //如果验证没通过，则不做处理
  }

  //验证通过
  //获得表单的数据
  const formData = new FormData(form); //得到表单数据对象（根据name为键，记录的键值对）
  const data = Object.fromEntries(formData.entries()); //得到数据对象

  //注册
  const fruit = await API.reg(data);
  if (fruit.code === 0) {
    alert("注册成功，点击确定，跳到登录页面");
    location.href = "./login.html";
  }
});
