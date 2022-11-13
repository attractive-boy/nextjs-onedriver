import React from "react";
import { DatePicker, PageHeader, Statistic, Table } from "antd";
import styles from "./CommonList.module.css";
import moment from "moment";
import Column from "antd/lib/table/Column";

interface Props {
  dataSource: any[];
}

const CommonList = (props: Props) => {
  const { dataSource } = props;
  return (
    <div className={styles.container}>
      {/* 标题 FILESHARE*/}
      <PageHeader title="FileShare" className="PageHeader" />
      <Table
        className={styles.table}
        dataSource={dataSource}
        scroll={{ y: 500 }}
        rowKey={(record) => record.id}
      >
        <Column
          title="文件"
          dataIndex="name"
          key="name"
          render={(text, record: any, index) => (
            <a className={styles.file_a} href={'/'+ record.name } key={index}>
              {text}
            </a>
          )}
        />
        <Column
          title="修改时间"
          dataIndex="lastModifiedDateTime"
          key="lastModifiedDateTime"
          width={400}
          render={(text, record, index: number) => (
            <DatePicker
              className="datePicker"
              showTime
              value={moment(text)}
              disabled
              key={index}
              bordered={false}
              size="large"
            />
          )}
        />
        <Column
          title="大小"
          dataIndex="size"
          key="size"
          // 宽度
          width={300}
          render={(size: number, record, index: number) => (
            // 保留两位小数
            <Statistic
              value={size / 1024 / 1024}
              precision={2}
              suffix="MB"
              key={index}
            />
          )}
        />
      </Table>
    </div>
  );
};

export default CommonList;
