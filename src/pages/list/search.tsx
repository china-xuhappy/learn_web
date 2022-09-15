import { useState } from "react";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Spin,
  message,
  Select
} from "antd";
import MyPagination, { PageInfo } from "@/components/pagination";
import { getMsg, sendEmail } from "@/api";
import MyTable from "@/components/table";
import "./index.less";
import { MessageList, MapKey } from "@/types"
import SupplierModal from "@/components/modal/supplier";
import VisitModal from "@/components/modal/visit";

export default function SearchPage() {
  
  const [searchForm] = Form.useForm();
  const [pageData, setPageData] = useState<PageInfo>({ page: 1 });
  const [tableData, setData] = useState<MessageList>([]);
  const [tableCol, setCol] = useState<MapKey>([]);
  const [load, setLoad] = useState(true);
  const [total, setTotal] = useState(0);
  const [showModal, setShow] = useState(false);

  const [showModalVisit, setShowVisit] = useState(false);

  const [supplierId, setSupplierId] = useState(null);

  const showInfoModal = (id, type) => {
    if(id){
      setSupplierId(id)
    }else{
      setSupplierId(null);
    }
    setShow(type)
  }


  const activeCol = {
    dataIndex: "active",
    key: "active",
    title: "操作",
    align: "center",
    width: "200px",
    render: (text: string , record) => {
      return <div>
        <Button type="link" onClick={() => showInfoModal(record.supplier_id, true)}>
        编辑
      </Button>
      <Button type="link" onClick={() => {
        setShowVisit(true)
        setSupplierId(record.supplier_id)
      }}>
        访问详情
      </Button>

      {record.status != 1 ? null : <Button type="link" onClick={() => {
        sendEmailx(record.supplier_id)
      }}>
        发送邮件
      </Button>}
      </div>
    },
  }

  const sendEmailx = (supplier_id: any) => {
    sendEmail({
      supplier_id
    }).then((res) => {
        message.success(res.msg);
    });
  };


  // 获取列表
  const getDataList = (data: PageInfo) => {
    console.log("getDataList")
    getMsg(data).then((res) => {
      const { data, status } = res;
      console.log(data, status,res ,"data, status")
      if (status === 0 && data) {
        let { list, total, mapKey } = data;
        mapKey = mapKey.map((i,index) => {
          if (i.key === "website") {
            i.render = text => <a href={text} target='_blank'>{text}</a>
          }
          if (i.key === "overseas_reg_no"){
            i.render = text => <a href='http://jckspj.customs.gov.cn/spj/zwgk75/2706880/2811812/4150146/index.html' target='_blank'>{text}</a>
          }

          if (i.key === "country"){
            i.render = text => <div>{text.country_name} ({text.time})</div>
          }

          if (i.key === "statusInfo"){
            i.render = text => <Select defaultValue={text.status} style={{ width: 120 }} allowClear>
            {
              Object.keys(text.status_enum).map((key) => {
                console.log(key, "key1111111111")
                return <Option value={parseInt(key)}>
                    {text.status_enum[key]}
               </Option>
              })
              }
          </Select>
          }

          return i;
        });
        mapKey.push(activeCol)

        setCol(mapKey);
        setTotal(total);
        setData(list.map((i) => ({ ...i, key: i.m_id })));
        setLoad(false);
        return;
      }
    });
  };

  

  // 顶部搜索
  const search = () => {
    console.log("search")
    let data = searchForm.getFieldsValue();
    setPageData({ page: 1 })
    getDataList(data);
  };

  // 页码改版
  const pageChange = (pageData: PageInfo) => {
    console.log("pageChange")
    let data = searchForm.getFieldsValue();
    getDataList({ ...pageData, ...data });
    setPageData(pageData);
  };

  const updateUserData = () => {
    setPageData(pageData);
  }

  const tableTop = (
    <Row justify="space-between" gutter={80}>
      <Col style={{ lineHeight: "32px" }}>表格查询</Col>
      <Col>
        <Button type="primary" onClick={() => showInfoModal(null, true)}>
          添加工厂
        </Button>
      </Col>
    </Row>
  );
  return (
    <div className="search-container">
      <Spin spinning={load}>
        <div className="top-form">
          <Form layout="inline" form={searchForm}>
            <Form.Item name="name">
              <Input placeholder="输入消息名称" />
            </Form.Item>
            <Form.Item name="description">
              <Input placeholder="输入消息描述词" />
            </Form.Item>
            <Button onClick={search} type="primary" className="submit-btn">
              搜索
            </Button>
            <Button
              onClick={() => {
                searchForm.resetFields();
                search();
              }}
            >
              清空
            </Button>
          </Form>
        </div>
        <MyTable
          title={() => tableTop}
          dataSource={tableData}
          columns={tableCol}
          pagination={false}
          saveKey="MyListSearch"
          rowKey="user_id"
        />
        <MyPagination
          page={pageData.page}
          immediately={getDataList}
          change={pageChange}
          total={total}
        />
      </Spin>

      <SupplierModal 
      isShow={showModal}
      supplier_id={supplierId}
      onCancel={showInfoModal}
      onOk={updateUserData}
      />

      <VisitModal 
        isShow={showModalVisit}
        supplier_id={supplierId}
        onCancel={setShowVisit}
      />
      
    </div>
  );
}
SearchPage.route = {
  [MENU_PATH]: "/list/search",
};
