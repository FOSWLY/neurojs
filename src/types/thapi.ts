export type GetSharingUrlSuccess = {
  status: "success";
  sharingUrl: string;
};

// ! SERVER ERRORS. DON'T EDIT !
export type GetSharingUrlMessage =
  | "not found"
  | "not authorized"
  | "article_url should not be empty";

export type GetSharingUrlFailed = {
  status: "error";
  message: GetSharingUrlMessage;
};

export type GetSharingUrlResponse = GetSharingUrlFailed | GetSharingUrlMessage;
export type GetSharingUrlOpts = {
  url: string;
};
