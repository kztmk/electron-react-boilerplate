// @flow
/**
 *  blog account型
 */
type BlogAccountType = {
  key: string,
  accountId: string,
  password: string,
  mailAddress: string,
  provider: string,
  title: string,
  description: string,
  url: string,
  remark: string,
  createDate: number,
  detailInfo: Array<string>,
  apiId: string,
  apiPass: string,
  blogId: string,
  endPoint: string,
  groupTags: string,
  affiliateTags: Array<string>
};

export default BlogAccountType;
