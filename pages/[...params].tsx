import FileList from "@/components/fileList/fileList";
import { getCode, getToken } from "@/service/auth.service";
import { getdir, download } from "@/service/api.service";

export async function getServerSideProps(context: any) {
  //判断token是否存在
  if (
    process.env.access_token == "0" ||
    process.env.access_token == "" ||
    process.env.access_token == undefined
  ) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } else {
    //去掉第一个/，因为getdir()里面已经有了
    let dirUrl = context.resolvedUrl.substring(1);
    const data = await getdir(dirUrl);
    if (data == "refresh") {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    } else if (data.value?.length == 0) {
      //下载文件
      const downloadEvent = await download(dirUrl);
      if (downloadEvent.status == 200) {
        return {
          redirect: {
            destination: downloadEvent.url,
            permanent: false,
          },
        };
      }
    }
    return {
      props: {
        data: data,
      },
    };
  }
}

const Post = (props: { data: any }) => {
  return (
    <FileList
      dataSource={props.data.value?.length > 0 ? props.data.value : []}
    />
  );
};

export default Post;
