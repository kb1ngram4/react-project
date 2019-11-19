import React,{Component} from 'react';
import {Form, Icon, Input, Button,message} from 'antd';
import axios from 'axios'
import './index.less';
import logo from './logo.png';
const {Item} = Form
@Form.create()
class Login extends Component{
  //定义validator方法表单校验
  validator = (rule,value,callback) =>{
    // console.log(rule,value,callback);
    //注意callback函数必须调用
    //判断 （提示错误信息只能显示一个）

    //判断是password还是username
    const name = rule.field === "username"?"用户名":"密码";
    
    if(!value){
      callback(`请输入${name}`);
    }else if(value.length<4){
      callback(`${name}长度必须大于4位`)
    }else if(value.length>13){
      callback(`${name}长度不超过13位`)
    }else if(!/\w/.test(value)){
      callback(`${name}必须是数字字母下划线`)
    }
  }
  login = e=>{
    e.preventDefault();
    //先进行表单校验
    this.props.form.validateFields((err,values)=>{
      // console.log(err,values);
      if(!err){
        //校验成功
        console.log(values);
        //看接口文档
        axios
          .post('http://localhost:5000/api/login',values)//key必须是username，password
          .then((response)=>{
            //请求成功->登陆成功->跳转到主页Home
            if(response.data.status === 0){
              this.props.history.push('/')
            }else{
              message.error(response.data.msg);
              this.props.form.resetFields(['password'])
            }
            
          })
          .catch(err=>{
            console.log(err);
            //提示错误
            message.error("网络故障，请刷新试试")
            this.props.form.resetFields(['password']);
          })

        
      }
    })
  }
  render(){  
    //getFieldDecorator方法也是一个高阶组件
    const{getFieldDecorator} = this.props.form; 
    return (
      <div className="login">
        <header className="login-header">
          <img src={logo} alt="logo"/>
          <h1>React项目: 后台管理系统</h1>
        </header>
        <section className = "login-section">
          <Form onSubmit = {this.login}>
            <h3>用户登录</h3>
            <Item>
            {
              getFieldDecorator( "username",{
                //表单校验规则
                rules:[
                  {
                    validator:this.validator
                  }
                  // {
                  //   required:true,//必填项
                  //   message:"请输入用户名"//表单校验失败提示的错误信息
                  // },
                  // {
                  //   min:4,
                  //   message:"用户名长度至少大于4位"
                  // },
                  // {
                  //   max:13,
                  //   message:"用户名长度最长不大于13位"
                  // },
                  // {
                  //   pattern:/\w/,
                  //   message:"用户名必须是数字字母下划线"
                  // }
                ]

              }

              )(
                <Input 
                prefix = {<Icon type = "user" className = "login-icon"/>}
                placeholder = "用户名"
              />
              )
            }             
            </Item>
            <Item>
              {
                // 自定义校验
                getFieldDecorator( "password",{
                  rules:[
                    {
                      validator:this.validator
                    }
                  ]
                })(
                <Input 
                  prefix = { <Icon type = 'lock'className = "login-icon" />}
                  //加密
                  type = "password"
                  placeholder = "请输入密码"
                />
                )
              }
            </Item>
            <Item>
              {/* 给button加一个htmlType属性 */}
              <Button type = "primary" className = "login-btn" htmlType = "submit">
                登录
              </Button>
            </Item>
          </Form>
        </section>
      </div>
    )
  }
}
//Form.create方法是一个高阶组件用法,作用：给组件传递from属性
// export default Form.create()(Login);
export default Login;