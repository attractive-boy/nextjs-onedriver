import React from "react";
import FileList from "@/components/fileList/fileList";
import { getCode, getToken } from "@/service/auth.service";
import { getdir } from "@/service/api.service";

export async function getServerSideProps(context: any) {
  //判断token是否存在
  if (process.env.access_token == '0' || process.env.access_token == '' || process.env.access_token == undefined) {
    //判断路由有没有code
    if (context.query.code) {
      //获取token
      const result = await getToken(context.query.code);
      process.env.access_token = result.access_token;
      process.env.refresh_token = result.refresh_token;
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    } else {
      //获取code
      const url = getCode(context.req);
      context.res.writeHead(302, {
        Location: url
      });
      context.res.end();
      return {
        props: {}
      };
    }
  } else {
    const data = await getdir();
    if(data == 'refresh'){
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }
    return {
      props: {
        data: data,
      },
    };
  }
}

export default function Home(props: { data: any }) {
  return (
    <FileList
      dataSource={props.data?.value?.length > 0 ? props.data.value : []}
    />
  );
}
