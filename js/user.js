/**
 * 登录和注册通用的表单验证
 */

class FieldValidator {
  /**
   * 构造器
   * @param {String} txtId      文本框ID
   * @param {*} validatorFunc   验证函数，验证参数为文本框的值，返回值为文本框的验证结果（错误消息/没有错误）
   */
  constructor(txtId, validatorFunc) {
    //保存元素and函数
    this.input = $("#" + txtId);
    this.p = this.input.nextElementSibling;
    this.validatorFunc = validatorFunc;

    //注册失去焦点事件
    this.input.addEventListener("blur", () => {
      this.validate();
    });
  }

  /**
   * 验证
   * 成功返回true
   * 失败返回false
   */
  async validate() {
    //得到验证结果
    const err = await this.validatorFunc(this.input.value);
    if (err) {
      this.p.innerText = err;
      return false;
    } else {
      this.p.innerText = "";
      return true;
    }
  }

  /**
   * 对传入的验证器经行统一的验证，
   * 如果所有的验证都通过，则返回true，否则返回false
   *
   * @param  {FieldValidator[]} validators
   * @returns 布尔值
   */
  static async validate(...validators) {
    const proms = validators.map((v) => v.validate()); //得到每个验证函数的结果组成的数组
    const result = await Promise.all(proms); //等待所有的proms完成，才完成
    return result.every((v) => v); //每一项都是true，才返回true，否则就返回false
  }
}

// const loginIdValidator = new FieldValidator("txtLoginId", async function (val) {
//   if (!val) {
//     return "账号不能为空";
//   }
//   const result = await API.exists(val);
//   if (result.data) {
//     //result 为true说明账号已存在
//     return "此账号已被占用，请填写新的账号";
//   }
// });

// const nicknameValidator = new FieldValidator("txtNickname", async function (
//   val
// ) {
//   if (!val) {
//     return "昵称不能为空";
//   }
// });

// function test() {
//   FieldValidator.validate(loginIdValidator, nicknameValidator).then(
//     (result) => {
//       console.log(result);
//     }
//   );
// }
