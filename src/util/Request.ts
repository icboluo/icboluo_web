import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { ElMessage } from "element-plus";
import { PageInfo } from "@/components/BaseTable.vue";

interface InterfaceRes<T = any> {
  data: T;
  code: string;
  message: string;
}

interface Res<T = any> extends AxiosResponse {
  /**
   * 状态码
   */
  code: string;
  /**
   * 消息
   */
  message: string;

  /**
   * 判断接口响应是否成功
   */
  isSuccess(): boolean;

  /**
   * 判断接口响应是否成功，如果失败，弹窗提示
   */
  isSuccessOrPopBox(): boolean;
}

class ResImpl<T = any> implements Res<T> {
  code: string;
  message: string;

  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: AxiosRequestConfig;
  request?: any;

  constructor(axi: AxiosResponse<InterfaceRes>) {
    this.code = axi.data.code;
    this.message = axi.data.message;

    this.data = axi.data.data;
    this.status = axi.status;
    this.statusText = axi.statusText;
    this.headers = axi.headers;
    this.config = axi.config;
    this.request = axi.request;
  }

  isSuccess(): boolean {
    return this.code === "0" || this.code === "200";
  }

  isSuccessOrPopBox(): boolean {
    if (this.isSuccess()) {
      return true;
    } else {
      ElMessage.error(this.message || "error");
      return false;
    }
  }
}

export async function axiosGet(url: string, param: any) {
  const axiosResponse = await axios.get(url, { params: param });
  return axiosResponse;
}

export async function get(url: string, param: any): Promise<Res> {
  const axiosResponse = await axios.get(url, { params: param });
  const resImpl = new ResImpl(axiosResponse);
  return resImpl;
}

export async function getPage<T extends PageInfo>(url: string, pageInfo: PageInfo, param?: any): Promise<Res<PageInfo>> {
  if (!param) {
    param = {};
  }
  Object.assign(param, pageInfo);
  const axiosResponse: AxiosResponse<InterfaceRes> = await axios.get(url, { params: param });
  const resImpl = new ResImpl(axiosResponse);
  pageInfo.pageNum = resImpl.data.pageNum;
  pageInfo.pageSize = resImpl.data.pageSize;
  pageInfo.total = resImpl.data.total;
  return resImpl;
}

// TODO 没有中断效果
export async function simpleGet(url: string, param: any): Promise<any> {
  let res = await get(url, param);
  if (res.isSuccessOrPopBox()) {
    return res.data;
  }
}

export default {
  axiosGet,
  get,
  simpleGet
};
