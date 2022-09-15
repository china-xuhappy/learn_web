import {
  Form,
  Input,
  Modal,
  message,
  FormInstance
} from "antd";
import { useEffect, useState } from "react";
import MyForm, { FormItemData } from "@/components/form";
import { countrys, createSupplier } from "@/api";

const initFormItems: FormItemData[] = [
  {
    itemType: "input",
    itemProps: {
      name: "original_name",
      rules: [
        { required: true, message: "请填写用户名" }, 
        { max: 500, message: "The name must be more than 500 words!"},
    ],
      label: "公司名",
    },
    childProps: {
      placeholder: "公司名",
    },
  },
  {
    itemType: "input",
    itemProps: {
      name: "website",
      rules: [{
        pattern: new RegExp(/(^(http|https):\/\/([\w\-]+\.)+[\w\-]+(\/[\w\u4e00-\u9fa5\-\.\/?\@\%\!\&=\+\~\:\#\;\,]*)?)/),
        message: "The website",
      }],
      label: "公司官网",
    },
    childProps: {
      placeholder: "公司官网",
    },
  },
  {
    itemType: "input",
    itemProps: {
      name: "overseas_reg_no",
      label: "注册编号",
      rules: [
        { required: true, message: "请填写注册编号" }, 
      ],
    },
    childProps: {
      placeholder: "注册编号"
    },
  },
  {
    itemType: "input",
    itemProps: {
      name: "wx_id",
      label: "微信号",
    },
    childProps: {
      placeholder: "微信号"
    },
  },
  {
    itemType: "input",
    itemProps: {
      name: "mobile",
      label: "手机号",
    },
    childProps: {
      placeholder: "手机号"
    },
  },
  ,
  {
    itemType: "input",
    itemProps: {
      name: "email",
      label: "邮箱",
    },
    childProps: {
      placeholder: "邮箱"
    },
  },
  {
    itemType: "select",
    itemProps: {
      rules: [{ required: true, message: "请选择国家" }],
      name: "country",
      label: "国家",
    },
    childProps: {
      placeholder: "国家",
      showSearch: true,
    },
  },
  ,
  {
    itemType: "select",
    itemProps: {
      rules: [{ required: true, message: "请选择种类" }],
      name: "varietys",
      label: "种类",
    },
    childProps: {
      placeholder: "种类",
      mode:"tags"
    },
  },
];

let countrys_list: any = []

const varietys = [
  {
    variety_id: 1,
    name: '猪'
  },
  {
    variety_id: 2,
    name: '牛'
  },
  {
    variety_id: 3,
    name: '鸡'
  }
]

export default function SupplierModal({supplier_id, isShow, onCancel, onOk}) {
  // const [form] = Form.useForm();
  const [form , setForm] = useState<FormInstance | null>(null);
  const [formItems, setFormItems] = useState<FormItemData []>([]);

  useEffect(() => {

    countrys({}).then((res) => {
      if (res.status === 0) {
        countrys_list = res.data
      }
    });

    let items = initFormItems.map(item => ({ ...item}));
    items.forEach((i) => {
      if (i.itemProps.name === "country"){
        i.childProps = { ...i.childProps }
        i.childProps.children = countrys_list.map((country) => (
          <Option value={country.country_en} key={country.country_en}>
            <div className="demo-option-label-item">
              {country.country_en} ({country.country_cn})
            </div>
          </Option>
        ));
      }

      if (i.itemProps.name === "varietys"){
        i.childProps = { ...i.childProps }
        i.childProps.children = varietys.map((variety) => (
          <Option value={variety.variety_id} key={variety.variety_id}>
            {variety.name}
          </Option>
        ));
      }
    })
    setFormItems(items);
  }, [isShow])

  useEffect(() => {
    if(supplier_id && form){

    } else if(!supplier_id){
      let items = initFormItems.map(item => ({...item,}));
      setFormItems(items);
    }
  },[supplier_id, form])

  // 添加列表
  const addList = () => {
    console.log("addList")
    form && form.validateFields().then((values) => {
      let modify = Boolean(supplier_id);
      if (modify) {
        values.supplier_id = supplier_id
      }else {
        values.supplier_id = null
      }
      createSupplier(values).then((res) => {
        if (res.status === 0) {
          form.resetFields();
          message.success(res.msg);
          close();
          onOk();
        }
      });
    });
  };

  const close = () => {
    onCancel(null, false);
  }

  return (
    <Modal
    title={supplier_id ? "修改信息" : "添加信息"}
    visible={isShow}
    cancelText="取消"
    okText="添加"
    onOk={addList}
    onCancel={close}
  >
    <MyForm handleInstance={setForm} items={formItems} />

    {/* <Form form={form} autoComplete="off" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
      <Form.Item
        label="公司名"
        name="original_name"
        
        rules={[
          {
            required: true,
            message: "Please input your name!",
          },
          {
            max: 500,
            message: "The name must be more than 500 words!",
          },
        ]}
      >
        <Input defaultValue="xuhappy 公司" key={+new Date() + Math.random()}/>
      </Form.Item>
      <Form.Item
        label="公司官网"
        name="website"
        rules={[
          {
            pattern: new RegExp(/(^(http|https):\/\/([\w\-]+\.)+[\w\-]+(\/[\w\u4e00-\u9fa5\-\.\/?\@\%\!\&=\+\~\:\#\;\,]*)?)/),
            message: "The website",
          },
        ]}
      >
        <Input defaultValue="https://ant.design"/>
      </Form.Item>
      <Form.Item
        label="微信号"
        name="wx_id"
      >
        <Input defaultValue="2222222222222"/>
      </Form.Item>
      <Form.Item
        label="手机号"
        name="mobile"
      >
        <Input defaultValue="1111111111111"/>
      </Form.Item>
      <Form.Item
        label="国家"
        name="country"
      >
        <Input defaultValue="中国"/>
      </Form.Item>
    </Form> */}
  </Modal>
  )
}