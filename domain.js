export type Author = {
  id: number,
  name: string,
};

export type Novel = {
  id: number,
  name: string,
  author: Author,
  type: any,
  firstChapter: number,
  createTime: string,
  introduce: string,
};

export type Content = {
  id: number,
  info: string,
};

export type Chapter = {
  id: number,
  bookId: number,
  nextChapterId: number,
  contentId: number,
  title: string,
  createTime: string,
  content: Content,
};

const CoverBaseUrl = 'https://admin.ndovel.com/cover/';

export function getCover(id: number) {
  if (!id) {
    return '';
  }
  return CoverBaseUrl + id.toString();
}

export class Version {
  constructor() {
    this.checked = false;
  }
  static version = '1.1.0';
  static getChecked() {
    return this.checked;
  }
  static check(version) {
    this.checked = true;
    return version === Version.version;
  }
}
