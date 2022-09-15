import {
  Skeleton,
  Input,
  Modal,
  Button,
  message,
  Avatar, 
  List,
  Comment,
  Tooltip
} from "antd";
import React, { useEffect, useState, memo} from "react";
import MyForm, { FormItemData } from "@/components/form";
import { getVisit, creatVisit } from "@/api";

import PropTypes from 'prop-types'
import moment from 'moment';
const { TextArea } = Input;

const VisitModal = memo(({isShow, onCancel, supplier_id}) => {

  const [content, setContent] = useState('');
  const [list, setList] = useState();

  console.log(supplier_id,11)

  useEffect(() => {
    getVisit({
      supplier_id: supplier_id
    }).then((res) => {
      if (res.status === 0) {
        console.log(res.data)
        setList(res.data);
      }
    });
  }, [supplier_id]);


  const close = () => {
    onCancel(false);
  }

  const addVisit = () => {
    creatVisit({
      content,
      supplier_id: supplier_id
    }).then((res) => {
      if (res.status === 0) {
        message.success(res.msg);
        setList([...list , {
          content,
          create_time: moment()
        }])
      }
    });
  }

  const onChange = (e: any) => {
    console.log("Change:", e.target.value);
    setContent(e.target.value)
  };

  return (
    <Modal
    title="访问咨询"
    visible={isShow}
    footer={null}
    onCancel={close}
  >

    {/* <TextArea showCount maxLength={100} onChange={onChange} /> */}

    <Input.Group compact>
      <Input style={{
          width: "calc(100% - 80px)"
        }} maxLength={100} value={content} onChange={onChange} placeholder='咨询内容'/>
      <Button type="primary" onClick={() => addVisit()}>Submit</Button>
    </Input.Group>
    
    <List
      className="demo-loadmore-list"
      itemLayout="horizontal"
      dataSource={list}
      renderItem={(item) => (
        // <List.Item
        //   actions={[<a key="list-loadmore-edit">edit</a>, <a key="list-loadmore-more">more</a>]}
        // >
        //   <Skeleton avatar title={false} loading={false} active>
        //     <List.Item.Meta
        //       avatar={<Avatar src="https://randomuser.me/api/portraits/women/71.jpg" />}
        //       title="Lauren Yuan"
        //       description={item}
        //     />
        //   </Skeleton>
        // </List.Item>
        <Comment
        author="Lauren Yuan"
        avatar="https://randomuser.me/api/portraits/women/71.jpg"
        content={item.content}
        datetime={
          <Tooltip title={moment(item.create_time).format('YYYY-MM-DD HH:mm:ss')}>
            <span>{moment(item.create_time, "YYYY-MM-DD HH:mm:ss").fromNow()}</span>
          </Tooltip>
        }
        />
      )}
    />
  </Modal>
  )
})

VisitModal.propTypes = {}

export default VisitModal