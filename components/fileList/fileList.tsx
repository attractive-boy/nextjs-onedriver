import React from "react";
import { DatePicker, Statistic, Table } from "antd";
import styles from "./fileList.module.css";
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
      {/* <PageHeader title="FileShare" className="PageHeader" /> */}
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
          render={(text, record: any) => (
            // 获取当前页面的路由
            <a className={styles.file_a} onClick={() => {
              window.location.href = window.location.href + '/' + record.name;
            }}>
              {text}
            </a>
          )}
        />
        <Column
          title="修改时间"
          dataIndex="lastModifiedDateTime"
          key="lastModifiedDateTime"
          width={400}
          render={(text) => (
            <DatePicker
              className="datePicker"
              showTime
              value={moment(text)}
              disabled
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
          width={200}
          render={(size: number) =>
            // 保留两位小数 自动计算使用啥单位 B KB MB GB
            //判断size适合使用哪个单位
            {
              let unit = "B";
              if (size > 1024) {
                size = size / 1024;
                unit = "KB";
              }
              if (size > 1024) {
                size = size / 1024;
                unit = "MB";
              }
              if (size > 1024) {
                size = size / 1024;
                unit = "GB";
              }
              return (
                <Statistic
                  className="statistic"
                  value={size}
                  precision={2}
                  valueStyle={{ fontSize: 20 }}
                  suffix={unit ?? "B"}
                />
              );
            }
          }
        />
        {/* <Column title="操作" dataIndex="action" key="action" 
        // 宽度
        width={200}
        render={(text, record: any) => (
          <a className={styles.file_a} onClick={() => {
            window.location.href = window.location.href + '/' + record.name + '?download';
          }}>
            下载
          </a>
        )} /> */}
      </Table>
    </div>
  );
};

export default CommonList;
