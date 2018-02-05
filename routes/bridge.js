var express = require('express');
var router = express.Router();
var async = require('async');
var login = require('../controllers/login');
var control = require('../controllers/control');
var people = require('../controllers/peopleControl');
var record = require('../controllers/recordControl');
var currency = require('../controllers/currencyRoute');
var systemSet = require('../controllers/systemSet');
var plan = require('../controllers/planControl');
var log = require('../controllers/logControl');
var role = require('../controllers/roleControl');
var check = require('../controllers/checkControl');
var file = require('../controllers/file');
var permiss = require('../controllers/permissControl');

router.get('/', login.index);                                     //首页
/**************************************************用户管理 start**************************************************/

router.post('/regist',login.regist);                            //用户注册
router.post('/userLogin',login.userLogin);                        //用户登录
router.post('/userLoginout', login.userLoginout);                 //退出登陆
// router.post('/updatePassword',login.updatePassword);           //修改密码
router.post('/add_user',login.add_user);                      //增加修改用户信息
router.post('/delete_user',login.delete_user);                //删除用户或管理员
// router.post('/get_resour',systemSet.get_resour);               //点击人员选项设置后默认查询单位级别数据
router.post('/getUser',systemSet.getUser);                        //分页获取所有用户信息
router.post('/addOrUser',systemSet.addOrUser);                    //添加或编辑用户信息
router.post('/delUser',systemSet.delUser);                        //删除用户
router.post('/getSingleUser',systemSet.getSingleUser);            //根据id获取用户信息。

/**************************************************用户管理 end**************************************************/

/**************************************************人员管理 start**************************************************/
router.post('/checkUserPermissionByName', permiss.checkUserPermissionByName);                       //获取用户权限
router.post('/getPeople', people.getPeople);                       //分页获取人员列表
router.post('/getPeopleId', people.getPeopleId);                       //根据ID获取人员信息
router.post('/add_people', people.add_people);                     //添加人员
router.post('/update_people', people.update_people);               //编辑人员
router.post('/delete_people', people.delete_people);               //删除人员
router.post('/getPeopleAttr', people.getPeopleAttr);               //获取人员表字段属性
router.post('/getPeopleType', people.getPeopleType);               //获取人员类别
router.post('/updateAttr', people.updateAttr);                     //修改属性是否显示

router.post('/addPeopleAttr', people.addPeopleAttr);               //增加人员表字段属性
router.post('/deletePeopleAttr', people.deletePeopleAttr);         //删除人员表字段属性
router.post('/editPeopleAttr', people.editPeopleAttr);             //编辑人员表字段属性
router.post('/chart_show', people.chart_show);                     //按单位展示人员图表

/************************************************** 人员管理 end ***************************************************/

/************************************************** 成绩管理 start* ************************************************/

router.post('/personRecord',record.personRecord);                   //获取个人所有成绩
router.post('/getRecord',record.getRecord);                         //根据单位获取人员成绩
router.post('/deleteRecord',record.deleteRecord);                   //删除人员成绩

/************************************************** 成绩管理 end ***************************************************/

/************************************************** 信息资料 start *************************************************/

router.post('/add_plan',plan.add_plan);                             //添加计划或指示
router.post('/push_plan',plan.push_plan);                          //推送计划或指示
router.post('/sup_delete_plan',plan.sup_delete_plan);              //上级单位删除计划或指示
router.post('/delete_plan',plan.delete_plan);                     //根据Id批量或单个删除计划或指示
router.post('/get_plan',plan.get_plan);                            //按单位分页获取指示推送
router.post('/get_planUrl',plan.get_planUrl);                      //根据ID获取指示推送URL
router.post('/editplanUrl',plan.editplanUrl);                      //编辑计划或指示

/************************************************** 信息资料 end **************************************************/

/************************************************** 远程考核 start ************************************************/
/**
 * 题库信息
 */
router.post('add_examinfo',check.add_examinfo);                    //添加试题
router.post('edit_examinfo',check.edit_examinfo);                  //修改试题
router.post('del_examinfo',check.del_examinfo);                    //删除试题
router.post('/down_examinfo',check.down_examinfo);                 //下载试题
// router.post('/get_test',check.get_test);                           //根据科目id获取试题列表

/**
 * 想定分发
 */
router.post('add_scenario',check.add_scenario);                    //添加想定
router.post('edit_scenario',check.edit_scenario);                  //修改想定
router.post('del_scenario',check.del_scenario);                    //删除想定
router.post('push_scenario',check.push_scenario);                  //发布想定

/**
 * 想定分发
 */
router.post('/addtestPlay',check.addtestPlay);                     //添加考试发布
router.post('/testPlay',check.testPlay);                           //批量发布考试任务
router.post('/editPlay',check.editPlay);                           //修改考试任务
router.post('/delPlay',check.delPlay);                             //删除考试任务
router.post('/getPlay',check.getPlay);                             //分页获取考试任务

/************************************************** 远程考核 end *************************************************/

/************************************************** 系统管理 start ************************************************/
router.post('/local_info',systemSet.local_info);                  //获取本机IP和计算机名
router.post('/db_backup',systemSet.db_backup);                    //数据库备份
router.post('/db_restore',systemSet.db_restore);                  //数据库还原

/**
 * 单位管理
 */
router.post('/getAllUnit',systemSet.getAllUnit);                    //获取所有单位
router.post('/getUnit',systemSet.getUnit);                          //获取一级单位
router.post('/getfirstUnit',systemSet.getfirstUnit);               //根据父id获取二级单位
router.post('/getupUnit',systemSet.getupUnit);                    //根据pid获取上级单位
router.post('/addUpdateUnit',systemSet.addUpdateUnit);             //增加修改单位
router.post('/delUnit',systemSet.delUnit);                         //删除单位

/**
 * 权限管理
 */
router.post('/add_role',role.add_role);                            //添加角色
router.post('/edit_role',role.edit_role);                          //修改角色
router.post('/del_role',role.del_role);                            //删除角色
router.post('/getRoleAction',role.getRoleAction);                  //根据角色获取权限
router.post('/getRole',role.getRole);                              //获取所有角色
router.post('/getAction',role.getAction);                          //获取所有权限
/**
 * 考核管理
 */
router.post('/add_project',check.add_project);                     //添加项目
router.post('/edit_project',check.edit_project);                   //修改项目
router.post('/del_project',check.del_project);                     //删除项目
router.post('/get_project',check.get_project);                     //分页查询项目

router.post('/add_subject',check.add_subject);                     //添加科目
router.post('/edit_subject',check.edit_subject);                   //修改科目
router.post('/del_subject',check.del_subject);                     //删除科目
router.post('/get_subject',check.get_subject);                     //根据项目id获取科目

/**
 * 操作(日志)管理
 */
router.post('/getLog',log.getLog);                                //分页排序查询日志列表

/************************************************** 系统管理 end ************************************************/

/************************************************** 通用方法 start **********************************************/

router.post('/pageWay', currency.pageWay);                       //通用分页方法
router.post('/diplay_chart', currency.diplay_chart);             //显示图表
router.post('/uploadSingle',file.uploadSingle);                  //单文件上传
router.post('/uploadMulti',file.uploadMulti);                    //多文件上传
router.post('/muchPageWay', currency.muchPageWay);               //通用分页方法

/************************************************** 通用方法 end ************************************************/
module.exports = router;
