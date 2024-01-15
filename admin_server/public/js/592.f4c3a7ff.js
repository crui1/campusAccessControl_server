"use strict";(self["webpackChunkadmin"]=self["webpackChunkadmin"]||[]).push([[592],{6043:function(t,e,s){s.d(e,{Z:function(){return c}});var a=function(){var t=this,e=t._self._c;return e("el-dropdown",{attrs:{trigger:"click"},on:{command:t.handleCommand}},[e("span",{staticClass:"el-dropdown-link"},[t._v(" "+t._s(t.title)),e("i",{staticClass:"el-icon-arrow-down el-icon--right"})]),e("el-dropdown-menu",{attrs:{slot:"dropdown"},slot:"dropdown"},[t.selection.length?t._e():e("div",{staticClass:"placeholder"},[t._v("无数据")]),t._l(t.selection,(function(s){return e("el-dropdown-item",{key:s.id,attrs:{"v-if":0!=t.selection.length,command:s.account||s.id,icon:t.icon}},[t._v(" "+t._s(s.name)+" ")])}))],2)],1)},o=[],l={name:"DropDown",props:{title:{typeof:"String",default:""},icon:{typeof:"String",default:"el-icon-s-custom"},selection:{typeof:"Array",default:()=>[]},infoID:{typeof:"String",default:""},additionalID:{typeof:"String",default:null}},methods:{handleCommand(t){this.$emit("choose",{infoID:this.infoID,chooseID:t,additionalID:this.additionalID||void 0})}}},i=l,r=s(1001),n=(0,r.Z)(i,a,o,!1,null,"4488ff44",null),c=n.exports},2592:function(t,e,s){s.r(e),s.d(e,{default:function(){return h}});var a=function(){var t=this,e=t._self._c;return e("div",{staticClass:"classinfo"},[e("el-card",{staticClass:"class-head mag-bottom"},[e("div",{staticClass:"add-search flex-between"},[e("el-button",{attrs:{type:"primary",size:"small",plain:""},on:{click:t.changeShowDialog}},[t._v("添加班级")]),e("div",[e("el-select",{staticStyle:{width:"100px"},attrs:{placeholder:"选择查询字段"},model:{value:t.field,callback:function(e){t.field=e},expression:"field"}},[e("el-option",{attrs:{label:"班级号",value:"id"}}),e("el-option",{attrs:{label:"班级名",value:"name"}})],1),t._v(" : "),e("el-input",{staticStyle:{width:"260px"},attrs:{placeholder:"请输入查询关键字","prefix-icon":"el-icon-search",clearable:!0},model:{value:t.keyword,callback:function(e){t.keyword="string"===typeof e?e.trim():e},expression:"keyword"}})],1)],1)]),e("el-card",{staticClass:"class-content"},[e("table",{staticClass:"table table-striped table-hover"},[e("thead",{staticClass:"thead-dark"},[e("tr",[e("th",{attrs:{scope:"col"}},[t._v("班级号")]),e("th",{attrs:{scope:"col"}},[t._v("班级名")]),e("th",{attrs:{scope:"col"}},[t._v("班主任")]),e("th",{attrs:{scope:"col"}},[t._v("操作")])])]),e("tbody",t._l(t.classes,(function(s){return e("tr",{key:s.id,attrs:{"v-if":t.classes.length>0}},[e("td",{attrs:{scope:"row"}},[t._v(t._s(s.id))]),e("td",[t._v(t._s(s.name))]),e("td",[t._v(" "+t._s(s.sname||"暂无")+" "),s.tcID?e("el-link",{staticClass:"my-c",attrs:{underline:!1,type:"warning"},on:{click:function(e){return t.cancelTeacher(s.id,s.tcID)}}},[t._v("撤销班主任")]):t._e()],1),e("td",[e("el-popconfirm",{attrs:{title:"确定删除吗？"},on:{confirm:function(e){return t.delClass(s.id,s.tcID)}}},[e("el-link",{attrs:{slot:"reference",type:"danger"},slot:"reference"},[t._v("删除班级")])],1),e("DropDown",{staticClass:"my-selector",attrs:{title:"设置班主任",selection:t.teachers,additionalID:s.tcID,infoID:s.id},on:{choose:t.alterHeadmaster}})],1)])})),0)]),0==t.classes.length?e("div",{staticClass:"table-placeholder"},[t._v("无信息")]):t._e()]),e("el-dialog",{attrs:{"close-on-click-modal":!1,title:"添加班级","show-close":!1,visible:t.showDialog},on:{"update:visible":function(e){t.showDialog=e}}},[e("el-form",{ref:"classInfo",attrs:{rules:t.rules,model:t.form,"status-icon":"","label-width":"120px"},nativeOn:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.submitForm("classInfo")}}},[e("el-form-item",{attrs:{prop:"name",label:"班级名称"}},[e("el-input",{attrs:{autocomplete:"off"},model:{value:t.form.name,callback:function(e){t.$set(t.form,"name","string"===typeof e?e.trim():e)},expression:"form.name"}})],1),e("el-form-item",{attrs:{prop:"id",label:"班级号"}},[e("el-input",{attrs:{autocomplete:"off"},model:{value:t.form.id,callback:function(e){t.$set(t.form,"id","string"===typeof e?e.trim():e)},expression:"form.id"}})],1),e("el-form-item",{attrs:{label:"班主任"}},[e("el-select",{attrs:{clearable:"",placeholder:"请选择班主任"},model:{value:t.form.tcID,callback:function(e){t.$set(t.form,"tcID",e)},expression:"form.tcID"}},t._l(t.teachers,(function(s){return e("el-option",{key:s.id,attrs:{"v-if":t.teachers.length>0,label:s.name,value:s.account}})})),1)],1)],1),e("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[e("el-button",{on:{click:t.cancelAdd}},[t._v("取 消")]),e("el-button",{attrs:{type:"primary"},on:{click:function(e){return t.submitForm("classInfo")}}},[t._v("确 定")])],1)],1)],1)},o=[],l=s(7877),i=s(6043),r={name:"Classes",data(){let t=(t,e,s)=>e?8!==e.length?s(new Error("请输入8位班级号")):(/^\d*$/.test(e)||s(new Error("请输入数字型班级号")),void s()):s(new Error("班级号不能为空"));return{keyword:"",field:"name",showDialog:!1,form:{id:"",name:"",tcID:void 0},rules:{id:[{validator:t,trigger:"blur",required:!0}],name:[{trigger:"blur",required:!0,message:"班级名不能为空"}]}}},components:{DropDown:i.Z},created(){this.$store.state.classes.length||this.getData()},methods:{getData(){this.$store.dispatch("getTeachers"),this.$store.dispatch("getClasses")},async delClass(t,e){const s=await l.Z.deleteClass({id:t}).catch((t=>{}));200==s.code&&(this.$message.success("删除成功"),e?this.getData():this.$store.dispatch("getClasses"),this.$bus.$emit("reGetStudent"))},changeShowDialog(){this.showDialog=!this.showDialog},async alterHeadmaster({infoID:t,chooseID:e,additionalID:s}){let a={id:t,tcID:e,originTcID:s};const o=await l.Z.alterClass(a).catch((()=>{}));200==o.code?(this.$message.success("修改成功"),this.getData()):this.$message.error("修改失败",error.$message)},async cancelTeacher(t,e){const s=await l.Z.cancelHeadmaster({id:t,tcID:e}).catch((t=>{}));200==s.code?(this.$message.success("取消成功"),this.getData()):(console.log(s),this.$message.error("取消失败"))},submitForm(t){this.$refs[t].validate((t=>{if(!t)return console.log("error submit!!"),!1;this.form.tcID||(this.form.tcID=void 0),this.addClass(this.form)}))},cancelAdd(){this.$refs.classInfo.resetFields(),this.changeShowDialog()},async addClass(t){const e=await l.Z.addClass(t).catch((t=>{}));200==e.code?(this.$message.success("添加成功"),t.tcID?this.getData():this.$store.dispatch("getClasses"),this.$refs.classInfo.resetFields(),this.changeShowDialog()):(console.log(e),this.$message.error(e.message))}},computed:{teachers:function(){return this.$store.state.teachers.filter((t=>!t.classID))},classes:function(){return this.$store.state.classes}},watch:{keyword:function(){this.$timer&&clearTimeout(this.$timer),this.$timer=setTimeout((()=>{this.$store.dispatch("getClasses",{keyword:this.keyword,field:this.field}),this.$timer=null}),800)}}},n=r,c=s(1001),d=(0,c.Z)(n,a,o,!1,null,"f51e6fae",null),h=d.exports}}]);
//# sourceMappingURL=592.f4c3a7ff.js.map